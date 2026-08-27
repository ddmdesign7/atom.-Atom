import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  Search, 
  Filter, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  TrendingUp, 
  TrendingDown, 
  Info, 
  Calendar, 
  Trash2, 
  ArrowRight,
  Zap,
  Heart,
  ShieldAlert
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  ReferenceArea,
  ReferenceLine 
} from 'recharts';
import { BiomarkerCategory, BiomarkerReading, BiomarkerStatus } from '../types';
import { BIOMARKER_CATALOG, CATEGORY_METADATA, getStatusColor, calculateBiomarkerStatus } from '../data/biomarkerCatalog';

interface BiomarkersViewProps {
  biomarkers: BiomarkerReading[];
  onOpenAddReading: (biomarkerId?: string) => void;
  onDeleteReading: (readingId: string) => Promise<void>;
}

export const BiomarkersView: React.FC<BiomarkersViewProps> = ({
  biomarkers,
  onOpenAddReading,
  onDeleteReading
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedBioId, setExpandedBioId] = useState<string | null>(null);
  const [unitMode, setUnitMode] = useState<'standard' | 'alternative'>('standard');

  // Group readings by biomarkerId
  const readingsByBioId = useMemo(() => {
    const map = new Map<string, BiomarkerReading[]>();
    biomarkers.forEach(b => {
      const list = map.get(b.biomarkerId) || [];
      list.push(b);
      map.set(b.biomarkerId, list);
    });

    // Ensure sorted chronologically for chart
    map.forEach((list) => {
      list.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    });
    return map;
  }, [biomarkers]);

  // Filter biomarker catalog
  const filteredCatalog = useMemo(() => {
    return BIOMARKER_CATALOG.filter(def => {
      // Category filter
      if (selectedCategory !== 'all' && def.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = def.name.toLowerCase().includes(q);
        const matchShort = def.shortName.toLowerCase().includes(q);
        const matchTag = def.tags.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchShort && !matchTag) return false;
      }

      // Status filter
      if (selectedStatus !== 'all') {
        const readings = readingsByBioId.get(def.id);
        const latest = readings && readings.length > 0 ? readings[readings.length - 1] : null;
        if (!latest) return false;

        if (selectedStatus === 'optimal' && latest.status !== 'optimal') return false;
        if (selectedStatus === 'borderline' && !['borderline_low', 'borderline_high'].includes(latest.status)) return false;
        if (selectedStatus === 'critical' && !['critical_low', 'critical_high'].includes(latest.status)) return false;
      }

      return true;
    });
  }, [selectedCategory, selectedStatus, searchQuery, readingsByBioId]);

  const categories = [
    { id: 'all', label: 'All Panels' },
    { id: 'metabolic', label: 'Metabolic' },
    { id: 'lipids', label: 'Lipids & Vascular' },
    { id: 'hormones', label: 'Hormones & Thyroid' },
    { id: 'vitamins', label: 'Vitamins & Minerals' },
    { id: 'inflammation', label: 'Inflammation' },
    { id: 'cardio', label: 'Cardiovascular' },
    { id: 'organ_function', label: 'Organ Function' },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header & Primary Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Biomarker Health Panels</h1>
          <p className="text-xs text-slate-700 font-medium mt-0.5">
            Clinical reference ranges, longitudinal trend curves, and lifestyle protocols
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Unit Toggle */}
          <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
            <button
              onClick={() => setUnitMode('standard')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                unitMode === 'standard' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Standard (US)
            </button>
            <button
              onClick={() => setUnitMode('alternative')}
              className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors ${
                unitMode === 'alternative' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              SI Metric (Alt)
            </button>
          </div>

          <button
            onClick={() => onOpenAddReading()}
            id="btn-add-reading-panel"
            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Record Value</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by biomarker name (e.g. Glucose, ApoB, Ferritin, TSH)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-bold text-slate-700">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="all">All Statuses</option>
              <option value="optimal">Optimal Only</option>
              <option value="borderline">Borderline Ranges</option>
              <option value="critical">Action Required</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === c.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Biomarker List Cards */}
      {filteredCatalog.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-2">
          <Activity className="w-8 h-8 text-slate-400 mx-auto" />
          <h3 className="text-sm font-bold text-slate-800">No matching biomarkers found</h3>
          <p className="text-xs text-slate-500">Try adjusting your category filter or search query.</p>
        </div>
      ) : (
        <div className="space-y-3.5">
          {filteredCatalog.map((def) => {
            const readings = readingsByBioId.get(def.id) || [];
            const latest = readings.length > 0 ? readings[readings.length - 1] : null;
            const isExpanded = expandedBioId === def.id;

            // Unit conversion
            const displayUnit = (unitMode === 'alternative' && def.alternativeUnit) ? def.alternativeUnit : def.standardUnit;
            const multiplier = (unitMode === 'alternative' && def.unitMultiplier) ? def.unitMultiplier : 1.0;

            const displayValue = latest ? (latest.value * multiplier).toFixed(1) : null;
            const optimalMinDisplay = (def.optimalMin * multiplier).toFixed(1);
            const optimalMaxDisplay = (def.optimalMax * multiplier).toFixed(1);

            const statusColor = latest ? getStatusColor(latest.status) : { badge: 'bg-slate-100 text-slate-600', label: 'No Data Yet' };

            // Chart data preparation
            const chartData = readings.map(r => ({
              date: new Date(r.timestamp).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
              value: Number((r.value * multiplier).toFixed(2)),
              raw: r
            }));

            // Range meter math
            const minScale = Math.min(def.criticalLowMin || def.optimalMin * 0.7, (latest?.value || def.optimalMin) * 0.85);
            const maxScale = Math.max(def.criticalHighMax || def.optimalMax * 1.3, (latest?.value || def.optimalMax) * 1.15);
            const rangeSpan = maxScale - minScale || 1;

            const optStartPct = Math.max(0, Math.min(100, ((def.optimalMin - minScale) / rangeSpan) * 100));
            const optEndPct = Math.max(0, Math.min(100, ((def.optimalMax - minScale) / rangeSpan) * 100));
            const currentPct = latest ? Math.max(0, Math.min(100, ((latest.value - minScale) / rangeSpan) * 100)) : 50;

            return (
              <div
                key={def.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:border-slate-300 transition-all"
                id={`biomarker-card-${def.id}`}
              >
                {/* Main Card Row */}
                <div 
                  onClick={() => setExpandedBioId(isExpanded ? null : def.id)}
                  className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none"
                >
                  {/* Left: Info */}
                  <div className="flex items-start sm:items-center gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-teal-800 flex items-center justify-center font-bold shrink-0">
                      <Activity className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-bold text-slate-900">{def.name}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                          {def.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium mt-0.5 line-clamp-1">
                        {def.description}
                      </p>
                    </div>
                  </div>

                  {/* Center: Visual Range Meter */}
                  <div className="flex-1 max-w-xs mx-auto md:mx-0 w-full">
                    <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400 mb-1">
                      <span>Low</span>
                      <span className="text-emerald-700 font-bold">Target: {optimalMinDisplay} – {optimalMaxDisplay}</span>
                      <span>High</span>
                    </div>

                    <div className="relative h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                      {/* Optimal Green Band */}
                      <div
                        className="absolute top-0 bottom-0 bg-emerald-400/50 rounded-full"
                        style={{
                          left: `${optStartPct}%`,
                          width: `${Math.max(4, optEndPct - optStartPct)}%`
                        }}
                      />
                      {/* Needle Indicator */}
                      {latest && (
                        <div
                          className="absolute top-0 bottom-0 w-2.5 -ml-1.25 bg-slate-900 rounded-full shadow-sm"
                          style={{ left: `${currentPct}%` }}
                        />
                      )}
                    </div>
                  </div>

                  {/* Right: Value & Status Badge */}
                  <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                    <div className="text-right">
                      {latest ? (
                        <>
                          <div className="text-base font-extrabold text-slate-900">
                            {displayValue} <span className="text-xs font-semibold text-slate-500">{displayUnit}</span>
                          </div>
                          <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${statusColor.badge}`}>
                            {statusColor.label}
                          </span>
                        </>
                      ) : (
                        <span className="text-xs font-semibold text-slate-400 italic">No readings</span>
                      )}
                    </div>

                    <div className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Details & Longitudinal History Chart */}
                {isExpanded && (
                  <div className="border-t border-slate-100 bg-slate-50/70 p-5 sm:p-6 space-y-5 animate-in fade-in duration-200">
                    
                    {/* Clinical Insight & Lifestyle Tip */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                          <Info className="w-4 h-4 text-teal-800" />
                          <span>Clinical Significance</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{def.clinicalMeaning}</p>
                      </div>

                      <div className="p-4 bg-white rounded-xl border border-slate-200 space-y-1">
                        <div className="flex items-center gap-2 text-xs font-bold text-emerald-800">
                          <Sparkles className="w-4 h-4 text-emerald-700" />
                          <span>Biomarker Optimization Protocol</span>
                        </div>
                        <p className="text-xs text-slate-700 leading-relaxed">{def.lifestyleTip}</p>
                      </div>
                    </div>

                    {/* Longitudinal Chart */}
                    {chartData.length > 1 ? (
                      <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-2">
                        <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                          <span>Longitudinal History ({chartData.length} entries)</span>
                          <span className="text-emerald-700 font-semibold">Optimal Band: {optimalMinDisplay} – {optimalMaxDisplay} {displayUnit}</span>
                        </div>
                        <div className="h-48 w-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                              <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#64748b' }} />
                              <YAxis tick={{ fontSize: 10, fill: '#64748b' }} domain={['auto', 'auto']} />
                              <Tooltip
                                contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', color: '#fff', fontSize: '11px' }}
                                formatter={(val: any) => [`${val} ${displayUnit}`, def.name]}
                              />
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#059669"
                                strokeWidth={2.5}
                                dot={{ fill: '#059669', r: 4 }}
                                activeDot={{ r: 6 }}
                              />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    ) : null}

                    {/* Historical Readings Table */}
                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                      <div className="px-4 py-2.5 bg-slate-100/70 border-b border-slate-200 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-800">Recorded Test Results</span>
                        <button
                          onClick={() => onOpenAddReading(def.id)}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add Reading</span>
                        </button>
                      </div>

                      {readings.length === 0 ? (
                        <div className="p-4 text-center text-xs text-slate-700">
                          No logged values for {def.name} yet. Click "Add Reading" above to record a test.
                        </div>
                      ) : (
                        <div className="divide-y divide-slate-100">
                          {readings.map((r) => {
                            const rStatus = getStatusColor(r.status);
                            const rVal = (r.value * multiplier).toFixed(1);
                            return (
                              <div key={r.id} className="px-4 py-3 flex items-center justify-between hover:bg-slate-50 text-xs">
                                <div className="space-y-0.5">
                                  <div className="font-bold text-slate-900 flex items-center gap-2">
                                    <span>{new Date(r.timestamp).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                    <span className="text-slate-700 font-medium">• {r.labName || 'Manual Entry'}</span>
                                  </div>
                                  {r.notes && <p className="text-[11px] text-slate-700">{r.notes}</p>}
                                </div>

                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <span className="font-extrabold text-slate-900 text-sm">{rVal} {displayUnit}</span>
                                    <span className={`ml-2 px-2 py-0.5 rounded-full text-[10px] font-bold border ${rStatus.badge}`}>
                                      {rStatus.label}
                                    </span>
                                  </div>
                                  <button
                                    onClick={() => onDeleteReading(r.id)}
                                    title="Delete reading"
                                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
