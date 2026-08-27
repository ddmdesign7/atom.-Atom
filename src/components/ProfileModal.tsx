import React, { useState } from 'react';
import { X, User, Heart, Download, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { UserProfile, BiomarkerReading, LabDocument, DailyBioLog } from '../types';
import { saveUserProfile } from '../lib/firebase';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile | null;
  onUpdateProfile: (updated: UserProfile) => void;
  allBiomarkers: BiomarkerReading[];
  allDocs: LabDocument[];
  allLogs: DailyBioLog[];
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onUpdateProfile,
  allBiomarkers,
  allDocs,
  allLogs
}) => {
  const [displayName, setDisplayName] = useState(profile?.displayName || '');
  const [age, setAge] = useState<number | ''>(profile?.age || 34);
  const [biologicalSex, setBiologicalSex] = useState<'male' | 'female' | 'other'>(profile?.biologicalSex || 'male');
  const [bloodType, setBloodType] = useState(profile?.bloodType || 'O+');
  const [weightLbs, setWeightLbs] = useState<number | ''>(profile?.weightLbs || 172);
  const [heightInches, setHeightInches] = useState<number | ''>(profile?.heightInches || 70);
  const [primaryGoal, setPrimaryGoal] = useState(profile?.primaryHealthGoal || 'Metabolic Longevity');
  const [unitSystem, setUnitSystem] = useState<'standard' | 'metric'>(profile?.unitSystem || 'standard');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen || !profile) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const updated: UserProfile = {
      ...profile,
      displayName,
      age: Number(age) || undefined,
      biologicalSex,
      bloodType: bloodType as any,
      weightLbs: Number(weightLbs) || undefined,
      heightInches: Number(heightInches) || undefined,
      primaryHealthGoal: primaryGoal as any,
      unitSystem,
      lastUpdated: new Date().toISOString()
    };

    await saveUserProfile(updated);
    onUpdateProfile(updated);
    setSaving(false);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  const handleExportData = () => {
    const exportBundle = {
      user: {
        uid: profile.uid,
        email: profile.email,
        displayName: profile.displayName,
        age: profile.age,
        biologicalSex: profile.biologicalSex,
        bloodType: profile.bloodType,
        primaryHealthGoal: profile.primaryHealthGoal,
        exportedAt: new Date().toISOString()
      },
      biomarkers: allBiomarkers,
      labDocumentsMetadata: allDocs.map(({ fileDataUrl, ...meta }) => meta),
      dailyBioLogs: allLogs
    };

    const blob = new Blob([JSON.stringify(exportBundle, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `BioBalance_Export_${profile.displayName.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]"
        id="profile-modal-card"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-heading">Health Profile & Clinical Settings</h2>
              <p className="text-xs text-slate-700 font-medium">{profile.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            id="btn-close-profile-modal"
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form */}
        <form onSubmit={handleSave} className="p-6 overflow-y-auto space-y-5">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-xs font-semibold">
              <Check className="w-4 h-4" />
              <span>Profile settings saved successfully.</span>
            </div>
          )}

          {/* Name & Demographic info */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Demographics & Physiology</h3>
            
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Display Name</label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Biological Sex</label>
                <select
                  value={biologicalSex}
                  onChange={(e) => setBiologicalSex(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="male">Male (XY)</option>
                  <option value="female">Female (XX)</option>
                  <option value="other">Other / Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Age</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Blood Type</label>
                <select
                  value={bloodType}
                  onChange={(e) => setBloodType(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="Unknown">Unknown</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Weight (lbs)</label>
                <input
                  type="number"
                  value={weightLbs}
                  onChange={(e) => setWeightLbs(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Height (in)</label>
                <input
                  type="number"
                  value={heightInches}
                  onChange={(e) => setHeightInches(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          </div>

          {/* Primary Health Focus */}
          <div className="space-y-3 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Longevity & Health Targets</h3>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Primary Optimization Goal</label>
              <select
                value={primaryGoal}
                onChange={(e) => setPrimaryGoal(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="Metabolic Longevity">Metabolic Longevity & Insulin Sensitivity</option>
                <option value="Hormonal Balance">Hormonal & Thyroid Equilibrium</option>
                <option value="Cardiovascular Health">Cardiovascular & Endothelial Protection</option>
                <option value="Inflammation Reduction">Systemic Inflammation Reduction</option>
                <option value="Energy & Vitality">Cellular Energy & Mitochondrial Vitality</option>
                <option value="Athletic Performance">Athletic Recovery & Muscle Synthesis</option>
              </select>
            </div>
          </div>

          {/* Export & Data Backup */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-teal-800" />
                <span className="text-xs font-bold text-slate-800">Export Clinical Archive</span>
              </div>
              <button
                type="button"
                id="btn-export-json"
                onClick={handleExportData}
                className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-lg transition-colors shadow-2xs"
              >
                Download JSON
              </button>
            </div>
            <p className="text-[11px] text-slate-700">
              Download all {allBiomarkers.length} biomarker readings, {allDocs.length} lab records, and {allLogs.length} daily logs in a portable JSON file.
            </p>
          </div>

          {/* Footer Submit */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              id="btn-save-profile"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
