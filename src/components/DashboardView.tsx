import React from 'react';
import { 
  Activity, 
  Sparkles, 
  FileText, 
  ArrowUpRight, 
  Calendar, 
  AlertTriangle, 
  Plus, 
  Upload, 
  Heart, 
  Zap, 
  ShieldAlert, 
  Sliders, 
  ChevronRight,
  TrendingUp,
  Award
} from 'lucide-react';
import { 
  UserProfile, 
  BiomarkerReading, 
  LabDocument, 
  DailyBioLog, 
  SystemScoreBreakdown, 
  BioBalanceInsight 
} from '../types';
import { CATEGORY_METADATA, getStatusColor } from '../data/biomarkerCatalog';

interface DashboardViewProps {
  profile: UserProfile | null;
  biomarkers: BiomarkerReading[];
  labDocs: LabDocument[];
  dailyLogs: DailyBioLog[];
  scoreBreakdown: SystemScoreBreakdown;
  insights: BioBalanceInsight[];
  onNavigateTab: (tab: string) => void;
  onOpenAddReading: (biomarkerId?: string) => void;
  onOpenUploadLab: () => void;
  onOpenDailyLog: () => void;
  onSelectBiomarker?: (bioId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  profile,
  biomarkers,
  labDocs,
  dailyLogs,
  scoreBreakdown,
  insights,
  onNavigateTab,
  onOpenAddReading,
  onOpenUploadLab,
  onOpenDailyLog
}) => {
  // Compute counts
  const latestBiomarkersMap = new Map<string, BiomarkerReading>();
  biomarkers.forEach(b => {
    if (!latestBiomarkersMap.has(b.biomarkerId)) {
      latestBiomarkersMap.set(b.biomarkerId, b);
    }
  });

  const latestList = Array.from(latestBiomarkersMap.values());
  const optimalCount = latestList.filter(b => b.status === 'optimal').length;
  const borderlineCount = latestList.filter(b => b.status === 'borderline_low' || b.status === 'borderline_high').length;
  const criticalCount = latestList.filter(b => b.status === 'critical_low' || b.status === 'critical_high').length;

  const getScoreRating = (score: number) => {
    if (score >= 90) return { label: 'Optimal Biological Balance', color: 'text-emerald-700', bg: 'bg-emerald-500' };
    if (score >= 80) return { label: 'Strong Physiological Health', color: 'text-teal-700', bg: 'bg-teal-500' };
    if (score >= 70) return { label: 'Moderate / Attention Required', color: 'text-amber-700', bg: 'bg-amber-500' };
    return { label: 'Sub-Optimal Biological Stress', color: 'text-rose-700', bg: 'bg-rose-500' };
  };

  const scoreRating = getScoreRating(scoreBreakdown.overall);

  // SVG Gauge calculations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (scoreBreakdown.overall / 100) * circumference;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Welcome Banner & Quick Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-slate-800 to-teal-950 p-6 md:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 space-y-1.5 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Biomarker & Longevity Protocol Active</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-heading">
            Welcome back, {profile?.displayName || 'Health Pioneer'}
          </h1>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Your physiological markers, hormone panels, and lab document vault are synchronized. Target: <span className="font-bold text-white">{profile?.primaryHealthGoal || 'Metabolic Longevity'}</span>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onOpenAddReading()}
            id="dash-btn-add-reading"
            className="flex items-center gap-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-md shadow-emerald-600/30 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Log Biomarker</span>
          </button>

          <button
            onClick={onOpenUploadLab}
            id="dash-btn-upload-lab"
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-colors"
          >
            <Upload className="w-4 h-4 text-teal-300" />
            <span>Upload Lab PDF</span>
          </button>

          <button
            onClick={onOpenDailyLog}
            id="dash-btn-daily-checkin"
            className="flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 text-white rounded-xl text-xs font-bold transition-colors"
          >
            <Calendar className="w-4 h-4 text-emerald-300" />
            <span>Daily Check-in</span>
          </button>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-gradient-to-l from-teal-500/10 to-transparent pointer-events-none" />
      </div>

      {/* Main Stats Row: Score Wheel + Health Distribution + Vital Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Bio Balance Score Card (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between" id="card-bio-balance-gauge">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-heading">Bio Balance Index</h2>
                <p className="text-xs text-slate-700 font-medium">Algorithmic biological equilibrium</p>
              </div>
              <div className="p-2 rounded-xl bg-slate-100 text-slate-600">
                <Award className="w-5 h-5 text-emerald-600" />
              </div>
            </div>

            {/* Circular Gauge */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-4">
              <div className="relative w-44 h-44 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    className="text-slate-100"
                    strokeWidth="16"
                    stroke="currentColor"
                    fill="transparent"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r={radius}
                    stroke="url(#balance-gradient)"
                    strokeWidth="16"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className="transition-all duration-1000 ease-out"
                  />
                  <defs>
                    <linearGradient id="balance-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#059669" />
                      <stop offset="100%" stopColor="#0d9488" />
                    </linearGradient>
                  </defs>
                </svg>

                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
                    {scoreBreakdown.overall}
                  </span>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-700">
                    out of 100
                  </span>
                </div>
              </div>

              {/* Status Breakdown Pills */}
              <div className="space-y-2.5 w-full sm:w-auto">
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-xs font-bold text-emerald-900">Optimal</span>
                  </div>
                  <span className="text-xs font-extrabold text-emerald-800">{optimalCount} markers</span>
                </div>

                <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-xs font-bold text-amber-900">Borderline</span>
                  </div>
                  <span className="text-xs font-extrabold text-amber-800">{borderlineCount} markers</span>
                </div>

                <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                    <span className="text-xs font-bold text-rose-900">Action Required</span>
                  </div>
                  <span className="text-xs font-extrabold text-rose-800">{criticalCount} markers</span>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className={`text-xs font-bold ${scoreRating.color}`}>
              ● {scoreRating.label}
            </span>
            <button
              onClick={() => onNavigateTab('biomarkers')}
              className="text-xs font-bold text-slate-700 hover:text-emerald-600 flex items-center gap-1"
            >
              <span>Explore All Markers</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* 6 Body Systems Breakdown (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-base font-bold text-slate-900 font-heading">Biological Systems Status</h2>
                <p className="text-xs text-slate-700 font-medium">Weighted calibration across critical organ pathways</p>
              </div>
              <button
                onClick={() => onNavigateTab('biomarkers')}
                className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
              >
                <span>View Panels</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Metabolic */}
              <div 
                onClick={() => onNavigateTab('biomarkers')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
                      <Zap className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Metabolic & Glycemic</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">{scoreBreakdown.metabolic}/100</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: `${scoreBreakdown.metabolic}%` }} />
                </div>
              </div>

              {/* Lipids */}
              <div 
                onClick={() => onNavigateTab('biomarkers')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-rose-300 hover:bg-rose-50/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-rose-100 text-rose-800">
                      <Heart className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Lipid & Vascular</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">{scoreBreakdown.lipids}/100</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full transition-all duration-500" style={{ width: `${scoreBreakdown.lipids}%` }} />
                </div>
              </div>

              {/* Hormones */}
              <div 
                onClick={() => onNavigateTab('biomarkers')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-100 text-indigo-800">
                      <Activity className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Hormones & Thyroid</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">{scoreBreakdown.hormones}/100</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-indigo-500 h-full rounded-full transition-all duration-500" style={{ width: `${scoreBreakdown.hormones}%` }} />
                </div>
              </div>

              {/* Vitamins & Minerals */}
              <div 
                onClick={() => onNavigateTab('biomarkers')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Vitamins & Minerals</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">{scoreBreakdown.vitamins}/100</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${scoreBreakdown.vitamins}%` }} />
                </div>
              </div>

              {/* Inflammation */}
              <div 
                onClick={() => onNavigateTab('biomarkers')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-orange-300 hover:bg-orange-50/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-orange-100 text-orange-800">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Inflammation & Immune</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">{scoreBreakdown.inflammation}/100</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-500 h-full rounded-full transition-all duration-500" style={{ width: `${scoreBreakdown.inflammation}%` }} />
                </div>
              </div>

              {/* Lifestyle / Circadian */}
              <div 
                onClick={() => onNavigateTab('daily_log')}
                className="p-3.5 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-teal-100 text-teal-800">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-slate-800">Circadian & Habits</span>
                  </div>
                  <span className="text-xs font-extrabold text-slate-900">{scoreBreakdown.lifestyle}/100</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-teal-500 h-full rounded-full transition-all duration-500" style={{ width: `${scoreBreakdown.lifestyle}%` }} />
                </div>
              </div>

            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-xs text-slate-700 flex items-center justify-between">
            <span>Last biomarker assessment: {biomarkers[0]?.timestamp ? new Date(biomarkers[0].timestamp).toLocaleDateString() : 'Today'}</span>
            <span className="font-semibold text-slate-700">24 biomarkers active</span>
          </div>
        </div>

      </div>

      {/* Priority Health Insights Banner */}
      {insights.length > 0 && (
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">Biological Balance Insights</h3>
                <p className="text-xs text-slate-700 font-medium">Evidence-based clinical correlations from your data</p>
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('advisor')}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>View All Guidance</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.slice(0, 2).map((ins) => (
              <div
                key={ins.id}
                className={`p-4 rounded-xl border ${
                  ins.type === 'alert' 
                    ? 'bg-rose-50/70 border-rose-200' 
                    : ins.type === 'warning'
                      ? 'bg-amber-50/70 border-amber-200'
                      : 'bg-emerald-50/70 border-emerald-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-1.5 rounded-lg shrink-0 ${
                    ins.type === 'alert' ? 'bg-rose-200 text-rose-800' : ins.type === 'warning' ? 'bg-amber-200 text-amber-800' : 'bg-emerald-200 text-emerald-800'
                  }`}>
                    {ins.type === 'alert' ? <AlertTriangle className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-slate-900">{ins.title}</h4>
                    <p className="text-xs text-slate-700 leading-relaxed">{ins.message}</p>
                    <div className="mt-2 pt-2 border-t border-slate-200/60 text-[11px] font-semibold text-slate-800">
                      <span className="text-emerald-700 font-bold">Action Protocol: </span>
                      {ins.actionProtocol}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Two Column Section: Recent Biomarker Readings + Lab Document Vault */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Recent Biomarker Updates (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">Key Biomarkers Snapshot</h3>
              <p className="text-xs text-slate-700 font-medium">Recent readings and biological ranges</p>
            </div>
            <button
              onClick={() => onNavigateTab('biomarkers')}
              className="text-xs font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>Explore All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {latestList.slice(0, 5).map((reading) => {
              const statusColor = getStatusColor(reading.status);
              return (
                <div
                  key={reading.id}
                  onClick={() => onNavigateTab('biomarkers')}
                  className="p-3.5 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs">
                      <Activity className="w-4 h-4 text-emerald-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-slate-900">{reading.biomarkerName}</span>
                        <span className="text-[10px] uppercase font-bold text-slate-400">
                          {reading.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium">
                        Source: {reading.labName || 'Manual Entry'} • {new Date(reading.timestamp).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="text-right flex items-center gap-3">
                    <div>
                      <div className="text-sm font-extrabold text-slate-900">
                        {reading.value} <span className="text-xs font-semibold text-slate-500">{reading.unit}</span>
                      </div>
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${statusColor.badge}`}>
                        {statusColor.label}
                      </span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Lab Document Vault (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 font-heading">Lab Document Vault</h3>
                <p className="text-xs text-slate-700 font-medium">Encrypted test reports & archives</p>
              </div>
              <button
                onClick={onOpenUploadLab}
                className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload</span>
              </button>
            </div>

            {labDocs.length === 0 ? (
              <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl space-y-2">
                <FileText className="w-8 h-8 text-slate-400 mx-auto" />
                <p className="text-xs font-bold text-slate-700">No lab documents stored yet</p>
                <p className="text-[11px] text-slate-500">Upload your Quest, Labcorp, or clinic PDF results</p>
                <button
                  onClick={onOpenUploadLab}
                  className="mt-2 px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold"
                >
                  Upload First Lab File
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {labDocs.slice(0, 3).map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => onNavigateTab('lab_vault')}
                    className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50 transition-all flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-800 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="max-w-[180px]">
                        <p className="text-xs font-bold text-slate-900 truncate">{doc.originalName}</p>
                        <p className="text-[11px] text-slate-700 font-medium">{doc.labClinic} • {doc.testDate}</p>
                      </div>
                    </div>

                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                      {doc.extractedBiomarkersCount} markers
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
            <span className="text-slate-700 font-semibold">{labDocs.length} documents archived</span>
            <button
              onClick={() => onNavigateTab('lab_vault')}
              className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
            >
              <span>Manage Vault</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
