import React, { useState, useMemo } from 'react';
import { X, Activity, Calendar, FileText, CheckCircle2, AlertTriangle, Info } from 'lucide-react';
import { BIOMARKER_CATALOG, calculateBiomarkerStatus, getStatusColor } from '../data/biomarkerCatalog';
import { BiomarkerReading, LabDocument } from '../types';

interface AddBiomarkerModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onAddReading: (reading: Omit<BiomarkerReading, 'id'>) => Promise<void>;
  availableDocs: LabDocument[];
  preselectedBiomarkerId?: string;
}

export const AddBiomarkerModal: React.FC<AddBiomarkerModalProps> = ({
  isOpen,
  onClose,
  userId,
  onAddReading,
  availableDocs,
  preselectedBiomarkerId
}) => {
  const [selectedBioId, setSelectedBioId] = useState(preselectedBiomarkerId || 'fasting_glucose');
  const [value, setValue] = useState<number | ''>('');
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [labName, setLabName] = useState('Quest Diagnostics');
  const [notes, setNotes] = useState('');
  const [linkedFileId, setLinkedFileId] = useState('');
  const [saving, setSaving] = useState(false);

  const currentDef = useMemo(() => {
    return BIOMARKER_CATALOG.find(b => b.id === selectedBioId) || BIOMARKER_CATALOG[0];
  }, [selectedBioId]);

  const liveStatus = useMemo(() => {
    if (value === '' || isNaN(Number(value))) return null;
    return calculateBiomarkerStatus(currentDef.id, Number(value));
  }, [currentDef, value]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (value === '' || isNaN(Number(value))) return;

    setSaving(true);
    try {
      await onAddReading({
        userId,
        biomarkerId: currentDef.id,
        biomarkerName: currentDef.name,
        category: currentDef.category,
        value: Number(value),
        unit: currentDef.standardUnit,
        status: liveStatus || 'optimal',
        timestamp: new Date(testDate).toISOString(),
        labName: labName.trim() || undefined,
        notes: notes.trim() || undefined,
        fileId: linkedFileId || undefined
      });
      onClose();
    } catch (err) {
      console.error('Failed to add reading', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        id="add-biomarker-modal-card"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">Record Biomarker Reading</h2>
              <p className="text-xs text-slate-700 font-medium">Log blood test values, vitals, or hormonal assays</p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="btn-close-add-bio-modal"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          
          {/* Biomarker Select */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Select Biomarker
            </label>
            <select
              id="select-biomarker-type"
              value={selectedBioId}
              onChange={(e) => {
                setSelectedBioId(e.target.value);
                setValue('');
              }}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {BIOMARKER_CATALOG.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name} ({b.standardUnit}) — [{b.category.toUpperCase()}]
                </option>
              ))}
            </select>
          </div>

          {/* Reference Range Guide Card */}
          <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-700" />
                Target Optimal Range:
              </span>
              <span className="font-extrabold text-emerald-900 bg-white px-2 py-0.5 rounded border border-emerald-200">
                {currentDef.optimalMin} – {currentDef.optimalMax} {currentDef.standardUnit}
              </span>
            </div>
            <p className="text-[11px] text-emerald-950 mt-1 leading-relaxed">
              {currentDef.description}
            </p>
          </div>

          {/* Value Input + Unit */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Result Value
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                step="any"
                required
                id="input-biomarker-value"
                value={value}
                onChange={(e) => setValue(e.target.value === '' ? '' : Number(e.target.value))}
                placeholder={`e.g. ${Math.round((currentDef.optimalMin + currentDef.optimalMax) / 2)}`}
                className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-lg font-bold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              />
              <div className="px-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 shrink-0">
                {currentDef.standardUnit}
              </div>
            </div>

            {/* Live Visual Status Feedback */}
            {liveStatus && (
              <div className="mt-2 flex items-center justify-between px-3 py-1.5 rounded-lg border text-xs font-bold animate-in fade-in duration-100" style={{}}>
                <span className="text-slate-600">Calculated Evaluation:</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-extrabold border ${getStatusColor(liveStatus).badge}`}>
                  {getStatusColor(liveStatus).label}
                </span>
              </div>
            )}
          </div>

          {/* Date & Lab Name */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Collection Date
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  id="input-collection-date"
                  value={testDate}
                  onChange={(e) => setTestDate(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Lab / Source
              </label>
              <input
                type="text"
                value={labName}
                id="input-lab-source"
                onChange={(e) => setLabName(e.target.value)}
                placeholder="Quest, LabCorp, Device..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Link to Lab Document (Optional) */}
          {availableDocs.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Link to Lab Document (Optional)
              </label>
              <select
                value={linkedFileId}
                onChange={(e) => setLinkedFileId(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">None / Manual Entry</option>
                {availableDocs.map((doc) => (
                  <option key={doc.id} value={doc.id}>
                    📄 {doc.originalName} ({doc.labClinic})
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Clinical Context / Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              id="input-reading-notes"
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. 12hr fast, morning blood draw prior to exercise..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || value === ''}
              id="btn-submit-reading"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1.5"
            >
              {saving ? 'Saving...' : 'Save Reading'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
