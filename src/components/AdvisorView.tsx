import React, { useState } from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Heart, 
  Zap, 
  Sun, 
  Moon, 
  Activity, 
  Pill,
  BookOpen,
  CheckSquare,
  Square
} from 'lucide-react';
import { BioBalanceInsight, BiomarkerReading, UserProfile } from '../types';

interface AdvisorViewProps {
  insights: BioBalanceInsight[];
  biomarkers: BiomarkerReading[];
  profile: UserProfile | null;
  onOpenAddReading: (biomarkerId?: string) => void;
}

export const AdvisorView: React.FC<AdvisorViewProps> = ({
  insights,
  biomarkers,
  profile,
  onOpenAddReading
}) => {
  const [activeChecklist, setActiveChecklist] = useState<Record<string, boolean>>({
    item_sunlight: true,
    item_walk: false,
    item_magnesium: true,
    item_hydration: false,
    item_zone2: true,
    item_winddown: false
  });

  const toggleCheck = (key: string) => {
    setActiveChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const completedCount = Object.values(activeChecklist).filter(Boolean).length;
  const totalCount = Object.keys(activeChecklist).length;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 via-teal-950 to-slate-900 p-6 md:p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="space-y-1.5 max-w-xl z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bio-Adaptive Guidance Engine</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight font-heading">
            Personalized Biological Advisor
          </h1>
          <p className="text-slate-300 text-xs md:text-sm leading-relaxed">
            Targeted protocols synthesized from your latest blood work, hormonal balance, and daily circadian rhythm.
          </p>
        </div>

        <div className="z-10 bg-white/10 border border-white/20 p-4 rounded-2xl text-center shrink-0">
          <span className="text-2xl font-black text-emerald-400">{completedCount}/{totalCount}</span>
          <p className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mt-0.5">Protocols Adhered Today</p>
        </div>
      </div>

      {/* Main Insights List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900 font-heading">
          High-Impact Biological Recommendations
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((ins) => (
            <div
              key={ins.id}
              className={`p-5 rounded-2xl border transition-all ${
                ins.type === 'alert'
                  ? 'bg-rose-50/70 border-rose-200 shadow-xs'
                  : ins.type === 'warning'
                    ? 'bg-amber-50/70 border-amber-200 shadow-xs'
                    : 'bg-white border-slate-200 shadow-2xs'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 font-bold ${
                  ins.type === 'alert'
                    ? 'bg-rose-200 text-rose-800'
                    : ins.type === 'warning'
                      ? 'bg-amber-200 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {ins.type === 'alert' ? (
                    <AlertTriangle className="w-5 h-5" />
                  ) : ins.type === 'warning' ? (
                    <Activity className="w-5 h-5" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                </div>

                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-sm font-bold text-slate-900">{ins.title}</h3>
                    <span className={`text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded ${
                      ins.priority === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {ins.priority} Priority
                    </span>
                  </div>

                  <p className="text-xs text-slate-700 leading-relaxed">{ins.message}</p>

                  <div className="p-3 bg-white/80 rounded-xl border border-slate-200/80 space-y-1">
                    <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider block">
                      Targeted Protocol:
                    </span>
                    <p className="text-xs font-semibold text-slate-800 leading-relaxed">
                      {ins.actionProtocol}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Daily Longevity Checklist + Evidence Guide */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Daily Protocol Checklist (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">Daily Biological Protocol Checklist</h3>
              <p className="text-xs text-slate-700 font-medium">Evidence-based habits to stabilize biomarker curves</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-xs">
              {Math.round((completedCount / totalCount) * 100)}%
            </div>
          </div>

          <div className="space-y-2.5">
            {[
              {
                id: 'item_sunlight',
                title: 'Morning Photobiomodulation',
                desc: '10-15 minutes of natural sunlight within 30 min of waking to calibrate Cortisol AM curve.',
                icon: Sun
              },
              {
                id: 'item_walk',
                title: 'Post-Prandial Glycemic Walk',
                desc: '10 minutes of light movement after lunch or dinner to blunt glucose spikes by up to 35%.',
                icon: Zap
              },
              {
                id: 'item_zone2',
                title: 'Zone 2 Cardiovascular Aerobic Base',
                desc: '30-45 minutes of nasal breathing steady-state cardio to build mitochondrial density.',
                icon: Heart
              },
              {
                id: 'item_hydration',
                title: 'Electrolyte Hydration Base',
                desc: 'Consume at least 80oz of clean water paired with adequate unrefined sodium and magnesium.',
                icon: Activity
              },
              {
                id: 'item_magnesium',
                title: 'Targeted Micronutrient Ingestion',
                desc: 'Take Magnesium Glycinate (300mg) and Vitamin D3+K2 with evening fats.',
                icon: Pill
              },
              {
                id: 'item_winddown',
                title: 'Circadian Digital Sundown',
                desc: 'Dim blue screens and lower bedroom ambient temp below 67°F 60 minutes before sleep.',
                icon: Moon
              }
            ].map((task) => {
              const isChecked = activeChecklist[task.id];
              const Icon = task.icon;
              return (
                <div
                  key={task.id}
                  onClick={() => toggleCheck(task.id)}
                  className={`p-3.5 rounded-xl border transition-all flex items-start gap-3 cursor-pointer select-none ${
                    isChecked
                      ? 'bg-emerald-50/50 border-emerald-200 text-emerald-950'
                      : 'bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <div className="mt-0.5">
                    {isChecked ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <div className="w-5 h-5 rounded-md border-2 border-slate-300 bg-white" />
                    )}
                  </div>

                  <div className="flex-1 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-bold ${isChecked ? 'line-through text-slate-500' : 'text-slate-900'}`}>
                        {task.title}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-700 leading-relaxed">{task.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Clinical Reference Standards Guide (6 cols) */}
        <div className="lg:col-span-6 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 font-heading">Optimal vs "Normal" Ranges</h3>
              <p className="text-xs text-slate-700 font-medium">Why Bio Balance uses preventive longevity thresholds</p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-slate-700 leading-relaxed">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <span className="font-bold text-slate-900 block">The "Standard" Lab Trap</span>
              <p>
                Standard laboratory reference ranges are based on standard distribution curves of the general population—including sedentary or metabolically unwell individuals. Being in the "normal" range simply means you match the statistical average.
              </p>
            </div>

            <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-200 space-y-1.5 text-emerald-950">
              <span className="font-bold text-emerald-950 block">Bio Balance "Optimal" Standards</span>
              <p>
                Our reference algorithms are calibrated against modern preventive medicine and longevity literature:
              </p>
              <ul className="list-disc pl-4 space-y-1 mt-1 font-medium">
                <li><strong>Fasting Glucose:</strong> 72–90 mg/dL (vs standard &lt; 99)</li>
                <li><strong>Vitamin D (25-OH):</strong> 50–80 ng/mL (vs standard 30+)</li>
                <li><strong>hs-CRP (Inflammation):</strong> &lt; 0.7 mg/L (vs standard &lt; 3.0)</li>
                <li><strong>TG / HDL Ratio:</strong> &lt; 1.5 for vascular safety</li>
              </ul>
            </div>

            <div className="pt-2 text-center">
              <p className="text-[11px] text-slate-600 italic">
                Bio Balance provides clinical wellness analytics and does not replace the direct relationship with your physician.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
