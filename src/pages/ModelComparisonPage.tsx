import React, { useState, useEffect } from 'react';
import { WeatherDataService } from '../services/dataService';
import { WeatherForecastRecord, RegimeCalendarDay } from '../types/weather';
import { MapComparisonSlider } from '../components/map/MapComparisonSlider';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from 'recharts';
import { TrendingUp, Award, CheckCircle, AlertCircle, BarChart3, Layers, Sliders, Info } from 'lucide-react';
import { MODELS } from '../config';

export const ModelComparisonPage: React.FC = () => {
  const [calendarDays, setCalendarDays] = useState<RegimeCalendarDay[]>([]);
  const [selectedDate, setSelectedDate] = useState('2023-07-05');
  const [forecasts, setForecasts] = useState<WeatherForecastRecord[]>([]);
  const [metricsData, setMetricsData] = useState<any>(null);
  const [selectedThreshold, setSelectedThreshold] = useState<'1mm' | '10mm' | '50mm' | '100mm'>('50mm');

  useEffect(() => {
    WeatherDataService.getMonsoonCalendar().then((days) => {
      setCalendarDays(days);
    });
    WeatherDataService.getMetricsData().then((data) => {
      setMetricsData(data);
    });
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    WeatherDataService.getForecastsByDate(selectedDate).then((records) => {
      setForecasts(records);
    });
  }, [selectedDate]);

  const thresholdMetrics = metricsData?.thresholdBreakdown?.[selectedThreshold] || [];
  const overallMetrics = metricsData?.overallMetrics || [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <BarChart3 className="w-5 h-5" />
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">Model Benchmark & Multi-Metric Verification</h2>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl">
          Scientific comparison of B1 Raw GFS baseline against B2 Quantile Mapping, B3 Generic XGBoost, and B4 Regime-Aware XGBoost across standard WMO / IMD verification metrics.
        </p>
      </div>

      {/* Model Definition Hierarchy Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {MODELS.map((m) => (
          <div key={m.id} className="glass-panel p-4 rounded-xl border border-slate-700/60 shadow-md">
            <div className="flex items-center justify-between mb-2">
              <span className={`px-2 py-0.5 rounded text-xs font-mono font-bold ${m.badgeClass}`}>
                {m.code}
              </span>
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: m.color }} />
            </div>
            <h4 className="text-sm font-bold text-white mb-1">{m.name}</h4>
            <span className="text-[11px] text-cyan-400 font-medium block mb-2">{m.shortDesc}</span>
            <p className="text-[11px] text-slate-400 leading-relaxed">{m.longDesc}</p>
          </div>
        ))}
      </div>

      {/* Synchronized Side-by-Side Map Comparison */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white">Synchronized Spatial Verification</h3>
            <p className="text-xs text-slate-400">
              Direct visual inspection between raw NWP, IMD ground truth observations, and the regime-aware AI forecast.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs">
            <span className="text-slate-400 px-2">Select Date:</span>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent text-slate-200 focus:outline-none cursor-pointer pr-3 font-mono"
            >
              {calendarDays.map((d) => (
                <option key={d.date} value={d.date} className="bg-slate-900 text-slate-200">
                  {d.date} ({d.regime})
                </option>
              ))}
            </select>
          </div>
        </div>

        <MapComparisonSlider forecasts={forecasts} dateStr={selectedDate} />
      </div>

      {/* Multi-Threshold Metric Comparison Section */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-white">Categorical Skill by Rainfall Threshold</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                SAMPLE BENCHMARK
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Evaluating CSI (Threat Score), POD (Hit Rate), FAR (False Alarm Ratio), and ETS across precipitation amounts.
            </p>
          </div>

          {/* Threshold Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs">
            <button
              onClick={() => setSelectedThreshold('1mm')}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                selectedThreshold === '1mm' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400'
              }`}
            >
              &gt; 1 mm (Rain/No-Rain)
            </button>
            <button
              onClick={() => setSelectedThreshold('10mm')}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                selectedThreshold === '10mm' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400'
              }`}
            >
              &gt; 10 mm (Moderate)
            </button>
            <button
              onClick={() => setSelectedThreshold('50mm')}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                selectedThreshold === '50mm' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40' : 'text-slate-400'
              }`}
            >
              &gt; 50 mm (Heavy Warning)
            </button>
            <button
              onClick={() => setSelectedThreshold('100mm')}
              className={`px-3 py-1.5 rounded-lg transition font-medium ${
                selectedThreshold === '100mm' ? 'bg-orange-500/20 text-orange-300 font-bold border border-orange-500/40' : 'text-slate-400'
              }`}
            >
              &gt; 100 mm (Very Heavy)
            </button>
          </div>
        </div>

        {/* Recharts Bar Chart Comparing B1 to B4 */}
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={thresholdMetrics}
              margin={{ top: 20, right: 30, left: 10, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="metric" stroke="#94A3B8" tick={{ fill: '#CBD5E1', fontSize: 12 }} />
              <YAxis stroke="#94A3B8" tick={{ fill: '#CBD5E1', fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#F8FAFC',
                  fontSize: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Bar dataKey="b1_raw" name="B1: Raw GFS" fill="#64748B" radius={[4, 4, 0, 0]} />
              <Bar dataKey="b2_qm" name="B2: Quantile Mapping" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="b3_xgb" name="B3: Generic XGBoost" fill="#6366F1" radius={[4, 4, 0, 0]} />
              <Bar dataKey="b4_regime_xgb" name="B4: Regime-Aware AI" fill="#22D3EE" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Verification Rules Callout from Research Specification */}
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex flex-col sm:flex-row items-start gap-3">
          <Info className="w-5 h-5 text-cyan-400 flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="text-white font-semibold">MoES / NCMRWF Verification Protocol:</strong> "A valid claim of forecast improvement cannot rely on RMSE alone. Because extreme rainfall events are highly imbalanced, lowering RMSE through excessive smoothing could degrade heavy-rain detection. Improvement requires <strong className="text-cyan-300">lower RMSE</strong> alongside <strong className="text-cyan-300">higher CSI and POD</strong> at high thresholds (≥50 mm) <strong className="text-cyan-300">without an explosion in FAR</strong>."
          </div>
        </div>
      </div>

      {/* Summary Scorecard of All Metrics */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-700/60 shadow-xl">
        <h3 className="text-base font-bold text-white mb-4">Complete Verification Scorecard</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="p-3">Evaluation Metric</th>
                <th className="p-3">Description</th>
                <th className="p-3 text-right">Raw GFS (B1)</th>
                <th className="p-3 text-right">Quantile (B2)</th>
                <th className="p-3 text-right">Generic ML (B3)</th>
                <th className="p-3 text-right text-cyan-300">Regime-AI (B4)</th>
                <th className="p-3 text-center">Relative Gain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {overallMetrics.map((row: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="p-3 font-sans font-bold text-white flex items-center gap-1.5">
                    <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                    {row.name} ({row.metric})
                  </td>
                  <td className="p-3 font-sans text-slate-400 text-[11px] max-w-xs">{row.description}</td>
                  <td className="p-3 text-right text-slate-400">{row.b1_raw} {row.unit}</td>
                  <td className="p-3 text-right text-blue-300">{row.b2_qm} {row.unit}</td>
                  <td className="p-3 text-right text-indigo-300">{row.b3_xgb} {row.unit}</td>
                  <td className="p-3 text-right text-cyan-300 font-bold bg-cyan-950/20">
                    {row.b4_regime_xgb} {row.unit}
                  </td>
                  <td className="p-3 text-center font-sans">
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                      +{row.improvementPct}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
