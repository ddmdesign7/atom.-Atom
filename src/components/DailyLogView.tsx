import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  Moon, 
  Droplet, 
  Footprints, 
  Zap, 
  Heart, 
  Smile, 
  Plus, 
  Save, 
  TrendingUp, 
  Clock,
  Sparkles,
  Check
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar 
} from 'recharts';
import { DailyBioLog } from '../types';

interface DailyLogViewProps {
  userId: string;
  dailyLogs: DailyBioLog[];
  onSaveDailyLog: (log: Omit<DailyBioLog, 'id'>) => Promise<void>;
}

export const DailyLogView: React.FC<DailyLogViewProps> = ({
  userId,
  dailyLogs,
  onSaveDailyLog
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  
  // Find if today already has a log
  const todayLog = dailyLogs.find(l => l.date === todayStr);

  const [date, setDate] = useState(todayStr);
  const [sleepHours, setSleepHours] = useState<number>(todayLog?.sleepHours || 7.5);
  const [sleepQuality, setSleepQuality] = useState<number>(todayLog?.sleepQuality || 4);
  const [hydrationOz, setHydrationOz] = useState<number>(todayLog?.hydrationOz || 80);
  const [restingHeartRate, setRestingHeartRate] = useState<number | ''>(todayLog?.restingHeartRate || 56);
  const [stressLevel, setStressLevel] = useState<number>(todayLog?.stressLevel || 2);
  const [steps, setSteps] = useState<number>(todayLog?.steps || 9500);
  const [energyLevel, setEnergyLevel] = useState<number>(todayLog?.energyLevel || 4);
  const [fastingHours, setFastingHours] = useState<number>(todayLog?.fastingHours || 14);
  const [notes, setNotes] = useState(todayLog?.notes || '');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await onSaveDailyLog({
        userId,
        date,
        sleepHours: Number(sleepHours),
        sleepQuality: Number(sleepQuality),
        hydrationOz: Number(hydrationOz),
        restingHeartRate: restingHeartRate === '' ? undefined : Number(restingHeartRate),
        stressLevel: Number(stressLevel),
        steps: Number(steps),
        energyLevel: Number(energyLevel),
        fastingHours: Number(fastingHours),
        notes: notes.trim() || undefined,
        createdAt: new Date().toISOString()
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      console.error('Failed to save daily log', err);
    } finally {
      setSaving(false);
    }
  };

  const addWater = (amount: number) => {
    setHydrationOz(prev => Math.max(0, prev + amount));
  };

  // Chart data sorted chronologically
  const chartData = [...dailyLogs]
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(-14)
    .map(log => ({
      date: new Date(log.date + 'T00:00:00').toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      sleep: log.sleepHours,
      hydration: log.hydrationOz,
      steps: log.steps,
      energy: log.energyLevel,
      stress: log.stressLevel
    }));

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Daily Bio-Log & Circadian Tracker</h1>
          <p className="text-xs text-slate-700 font-medium mt-0.5">
            Log sleep cycles, hydration volume, step activity, and autonomic stress recovery
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-700">Targeting:</span>
          <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-extrabold border border-emerald-200">
            Optimal Circadian Synchronization
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Daily Entry Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5" id="form-daily-bio-log">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-teal-100 text-teal-800">
                <CalendarIcon className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900 font-heading">Record Today's Bio-Metrics</h2>
                <p className="text-xs text-slate-700 font-medium">Daily habits dynamically influence your Bio Balance score</p>
              </div>
            </div>

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2 text-emerald-700 text-xs font-semibold animate-in fade-in duration-100">
              <Check className="w-4 h-4" />
              <span>Daily Bio-Log saved and factored into your Bio Balance Index!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-4">
            
            {/* Sleep & Quality */}
            <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                  <Moon className="w-4 h-4 text-indigo-600" />
                  Sleep Duration & Quality
                </span>
                <span className="text-xs font-extrabold text-indigo-900">{sleepHours} hrs</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="range"
                    min="3"
                    max="12"
                    step="0.25"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(Number(e.target.value))}
                    className="w-full accent-indigo-600 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-indigo-950 mt-0.5">
                    <span>4 hrs</span>
                    <span className="font-bold text-indigo-900">7.5–8.5 (Optimal)</span>
                    <span>12 hrs</span>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setSleepQuality(star)}
                        className={`flex-1 py-1 text-xs font-bold rounded-lg transition-colors ${
                          sleepQuality >= star ? 'bg-indigo-600 text-white' : 'bg-indigo-100 text-indigo-400 hover:bg-indigo-200'
                        }`}
                      >
                        {star}★
                      </button>
                    ))}
                  </div>
                  <div className="text-[10px] text-indigo-950 text-center mt-1">
                    {sleepQuality === 5 ? 'Deep Restorative' : sleepQuality >= 4 ? 'Refreshed' : 'Sub-optimal'}
                  </div>
                </div>
              </div>
            </div>

            {/* Hydration */}
            <div className="p-4 bg-cyan-50/50 rounded-xl border border-cyan-100 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-950 flex items-center gap-1.5">
                  <Droplet className="w-4 h-4 text-cyan-600" />
                  Hydration Volume
                </span>
                <span className="text-xs font-extrabold text-cyan-900">{hydrationOz} oz ({(hydrationOz * 0.02957).toFixed(1)} L)</span>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="number"
                  min="0"
                  max="300"
                  value={hydrationOz}
                  onChange={(e) => setHydrationOz(Number(e.target.value))}
                  className="w-24 px-3 py-1.5 bg-white border border-cyan-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
                
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => addWater(8)}
                    className="px-2.5 py-1.5 bg-white hover:bg-cyan-100 border border-cyan-200 text-cyan-800 text-xs font-bold rounded-lg transition-colors"
                  >
                    +8 oz
                  </button>
                  <button
                    type="button"
                    onClick={() => addWater(16)}
                    className="px-2.5 py-1.5 bg-white hover:bg-cyan-100 border border-cyan-200 text-cyan-800 text-xs font-bold rounded-lg transition-colors"
                  >
                    +16 oz (Glass)
                  </button>
                  <button
                    type="button"
                    onClick={() => addWater(32)}
                    className="px-2.5 py-1.5 bg-white hover:bg-cyan-100 border border-cyan-200 text-cyan-800 text-xs font-bold rounded-lg transition-colors"
                  >
                    +32 oz (Bottle)
                  </button>
                </div>
              </div>
            </div>

            {/* Steps & Resting HR */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Footprints className="w-3.5 h-3.5 text-slate-400" />
                  Daily Steps
                </label>
                <input
                  type="number"
                  step="100"
                  value={steps}
                  onChange={(e) => setSteps(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  Resting HR (bpm)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 54"
                  value={restingHeartRate}
                  onChange={(e) => setRestingHeartRate(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>

            {/* Stress & Energy Ratings */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Stress Intensity (1 low, 5 high)
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setStressLevel(lvl)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                        stressLevel === lvl 
                          ? lvl <= 2 ? 'bg-emerald-600 text-white' : lvl === 3 ? 'bg-amber-500 text-white' : 'bg-rose-600 text-white'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Energy & Vitality (1-5)
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((lvl) => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setEnergyLevel(lvl)}
                      className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-colors ${
                        energyLevel === lvl ? 'bg-amber-500 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Fasting Hours */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                Intermittent Fasting Window
              </label>
              <div className="flex items-center gap-2">
                {[12, 14, 16, 18, 20, 24].map((hours) => (
                  <button
                    key={hours}
                    type="button"
                    onClick={() => setFastingHours(hours)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                      fastingHours === hours ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {hours}h
                  </button>
                ))}
              </div>
            </div>

            {/* Daily Reflections */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Daily Physiological Reflection (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Completed Zone 2 session, fasted workout, cold therapy..."
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              id="btn-save-daily-log"
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white text-xs font-bold rounded-xl shadow-xs transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? 'Syncing...' : 'Save Daily Bio-Log'}</span>
            </button>
          </form>
        </div>

        {/* Multi-day Trend Analytics (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Sleep vs Stress Correlation Chart */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-heading">Sleep vs Stress Trend</h3>
                <p className="text-xs text-slate-700 font-medium">Recent 14-day autonomic correlation</p>
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold">
                <span className="text-indigo-600">● Sleep (hrs)</span>
                <span className="text-rose-500">● Stress (1-5)</span>
              </div>
            </div>

            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 5, right: 5, left: -25, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={[0, 12]} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                  <Line type="monotone" dataKey="sleep" stroke="#4f46e5" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="stress" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Steps & Movement Volume */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 font-heading">Daily Step Activity</h3>
                <p className="text-xs text-slate-700 font-medium">Target: 8,000+ daily steps</p>
              </div>
              <span className="text-xs font-bold text-emerald-700">Movement Volume</span>
            </div>

            <div className="h-40 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 5, right: 5, left: -15, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                  <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }} />
                  <Bar dataKey="steps" fill="#0d9488" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Past 7 Days History Pill List */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
              Recent Bio-Log History
            </span>

            <div className="space-y-1.5 max-h-48 overflow-y-auto">
              {dailyLogs.slice(0, 7).map((log) => (
                <div
                  key={log.id}
                  onClick={() => {
                    setDate(log.date);
                    setSleepHours(log.sleepHours);
                    setSleepQuality(log.sleepQuality);
                    setHydrationOz(log.hydrationOz);
                    setRestingHeartRate(log.restingHeartRate || '');
                    setStressLevel(log.stressLevel);
                    setSteps(log.steps);
                    setEnergyLevel(log.energyLevel);
                    setFastingHours(log.fastingHours || 14);
                    setNotes(log.notes || '');
                  }}
                  className="p-2 rounded-xl border border-slate-100 hover:bg-slate-50 flex items-center justify-between text-xs cursor-pointer transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{log.date}</span>
                    <span className="text-slate-500 font-medium">({log.sleepHours}h sleep, {log.steps.toLocaleString()} steps)</span>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 hover:underline">
                    Edit
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
