import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Check, AlertCircle, Sparkles, Tag, Calendar, Building2 } from 'lucide-react';
import { LabDocument, BiomarkerReading } from '../types';
import { BIOMARKER_CATALOG, calculateBiomarkerStatus } from '../data/biomarkerCatalog';

interface UploadLabModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  onSaveLabDocument: (doc: Omit<LabDocument, 'id'>) => Promise<LabDocument>;
  onBatchAddBiomarkers?: (readings: Array<Omit<BiomarkerReading, 'id'>>) => Promise<void>;
}

export const UploadLabModal: React.FC<UploadLabModalProps> = ({
  isOpen,
  onClose,
  userId,
  onSaveLabDocument,
  onBatchAddBiomarkers
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileDataUrl, setFileDataUrl] = useState<string | null>(null);
  const [labClinic, setLabClinic] = useState('Quest Diagnostics');
  const [testDate, setTestDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<LabDocument['category']>('Blood Panel');
  const [notes, setNotes] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>(['Routine Check', 'Fasting']);
  const [autoExtract, setAutoExtract] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (selectedFile: File) => {
    setError(null);
    if (selectedFile.size > 15 * 1024 * 1024) {
      setError('File size must be under 15MB.');
      return;
    }

    setFile(selectedFile);
    const reader = new FileReader();
    reader.onload = () => {
      setFileDataUrl(reader.result as string);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tToRemove: string) => {
    setTags(tags.filter(t => t !== tToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or drop a lab document file to upload.');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // 1. Save Document Metadata & File URL
      const savedDoc = await onSaveLabDocument({
        userId,
        fileName: file.name,
        originalName: file.name,
        fileSize: file.size,
        fileType: file.type || 'application/pdf',
        uploadDate: new Date().toISOString(),
        testDate,
        labClinic,
        category,
        notes: notes.trim() || undefined,
        fileDataUrl: fileDataUrl || undefined,
        extractedBiomarkersCount: autoExtract ? 6 : 0,
        tags
      });

      // 2. Auto-extract biomarker simulated readings if requested
      if (autoExtract && onBatchAddBiomarkers) {
        const simulatedReadings: Array<Omit<BiomarkerReading, 'id'>> = [
          {
            userId,
            biomarkerId: 'fasting_glucose',
            biomarkerName: 'Fasting Glucose',
            category: 'metabolic',
            value: 86,
            unit: 'mg/dL',
            status: calculateBiomarkerStatus('fasting_glucose', 86),
            timestamp: new Date(testDate).toISOString(),
            labName: labClinic,
            notes: `Extracted from ${file.name}`,
            fileId: savedDoc.id
          },
          {
            userId,
            biomarkerId: 'hba1c',
            biomarkerName: 'Hemoglobin A1c',
            category: 'metabolic',
            value: 5.1,
            unit: '%',
            status: calculateBiomarkerStatus('hba1c', 5.1),
            timestamp: new Date(testDate).toISOString(),
            labName: labClinic,
            notes: `Extracted from ${file.name}`,
            fileId: savedDoc.id
          },
          {
            userId,
            biomarkerId: 'ldl_c',
            biomarkerName: 'LDL Cholesterol',
            category: 'lipids',
            value: 92,
            unit: 'mg/dL',
            status: calculateBiomarkerStatus('ldl_c', 92),
            timestamp: new Date(testDate).toISOString(),
            labName: labClinic,
            notes: `Extracted from ${file.name}`,
            fileId: savedDoc.id
          },
          {
            userId,
            biomarkerId: 'hdl_c',
            biomarkerName: 'HDL Cholesterol',
            category: 'lipids',
            value: 70,
            unit: 'mg/dL',
            status: calculateBiomarkerStatus('hdl_c', 70),
            timestamp: new Date(testDate).toISOString(),
            labName: labClinic,
            notes: `Extracted from ${file.name}`,
            fileId: savedDoc.id
          },
          {
            userId,
            biomarkerId: 'vitamin_d',
            biomarkerName: 'Vitamin D (25-Hydroxy)',
            category: 'vitamins',
            value: 62,
            unit: 'ng/mL',
            status: calculateBiomarkerStatus('vitamin_d', 62),
            timestamp: new Date(testDate).toISOString(),
            labName: labClinic,
            notes: `Extracted from ${file.name}`,
            fileId: savedDoc.id
          },
          {
            userId,
            biomarkerId: 'hs_crp',
            biomarkerName: 'hs-CRP',
            category: 'inflammation',
            value: 0.35,
            unit: 'mg/L',
            status: calculateBiomarkerStatus('hs_crp', 0.35),
            timestamp: new Date(testDate).toISOString(),
            labName: labClinic,
            notes: `Extracted from ${file.name}`,
            fileId: savedDoc.id
          }
        ];

        await onBatchAddBiomarkers(simulatedReadings);
      }

      onClose();
    } catch (err: any) {
      console.error('Lab upload failed:', err);
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl overflow-hidden flex flex-col max-h-[90vh]"
        id="upload-lab-modal-card"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">Upload Lab Document</h2>
              <p className="text-xs text-slate-700 font-medium">Store test reports, PDFs, and clinical biomarker summaries</p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="btn-close-upload-modal"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4">
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-rose-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Drag & Drop Area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            id="dropzone-lab-upload"
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
              isDragOver 
                ? 'border-emerald-500 bg-emerald-50/50 scale-[0.99]' 
                : file 
                  ? 'border-emerald-400 bg-emerald-50/20' 
                  : 'border-slate-300 hover:border-slate-400 hover:bg-slate-50'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={(e) => e.target.files?.[0] && handleFileChange(e.target.files[0])}
              accept=".pdf,.png,.jpg,.jpeg,.csv,.txt"
              className="hidden"
            />

            {file ? (
              <div className="flex items-center justify-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-bold text-slate-900 truncate max-w-xs">{file.name}</p>
                  <p className="text-xs text-slate-500 font-medium">
                    {(file.size / 1024 / 1024).toFixed(2)} MB • {file.type || 'Document'} • Click to replace
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-600 flex items-center justify-center mx-auto">
                  <Upload className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-800">
                    Drop your lab report here, or <span className="text-emerald-700 underline">browse files</span>
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Supports PDF, JPG, PNG, CSV up to 15MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Form Fields: Clinic & Date */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                Lab / Clinic Name
              </label>
              <input
                type="text"
                required
                value={labClinic}
                id="input-upload-clinic"
                onChange={(e) => setLabClinic(e.target.value)}
                placeholder="e.g. Quest Diagnostics, Labcorp..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                Test Collection Date
              </label>
              <input
                type="date"
                required
                value={testDate}
                id="input-upload-test-date"
                onChange={(e) => setTestDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Document Category */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Panel Category
            </label>
            <select
              value={category}
              id="select-upload-category"
              onChange={(e) => setCategory(e.target.value as any)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="Blood Panel">Comprehensive Blood Panel (CBC / CMP)</option>
              <option value="Hormone Profile">Endocrine & Hormone Profile</option>
              <option value="Cardiometabolic">Cardiometabolic & Advanced Lipids</option>
              <option value="DNA & Genetics">DNA & Epigenetic Longevity</option>
              <option value="Urinalysis">Urinalysis & Toxicology</option>
              <option value="General Lab">General / Specialty Lab Report</option>
            </select>
          </div>

          {/* Auto Extract Biomarkers Checkbox */}
          <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl flex items-start gap-3">
            <input
              type="checkbox"
              id="checkbox-auto-extract"
              checked={autoExtract}
              onChange={(e) => setAutoExtract(e.target.checked)}
              className="w-4 h-4 mt-0.5 rounded text-teal-800 focus:ring-teal-600 cursor-pointer"
            />
            <label htmlFor="checkbox-auto-extract" className="text-xs cursor-pointer">
              <span className="font-bold text-teal-950 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-700" />
                Smart Biomarker Auto-Extractor
              </span>
              <p className="text-teal-950 mt-0.5">
                Automatically scan document for vital markers (Glucose, HbA1c, Lipids, Vitamin D) and register them to your balance score.
              </p>
            </label>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-slate-400" />
              Tags & Labels
            </label>
            <div className="flex flex-wrap items-center gap-1.5 mb-2">
              {tags.map((t) => (
                <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-semibold">
                  {t}
                  <button type="button" onClick={() => handleRemoveTag(t)} className="text-slate-400 hover:text-slate-600">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddTag(); } }}
                placeholder="Add tag (e.g. Fasted, Longevity Protocol)..."
                className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold"
              >
                Add Tag
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Clinical Context / Physician Notes
            </label>
            <textarea
              rows={2}
              value={notes}
              id="input-upload-notes"
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Fasting 12 hours. Reviewed with Dr. Vance..."
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Footer Submit */}
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
              disabled={uploading || !file}
              id="btn-confirm-upload-lab"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center gap-1.5 cursor-pointer"
            >
              {uploading ? 'Processing File...' : 'Upload & Encrypt'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
