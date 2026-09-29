import React, { useState, useEffect } from 'react';
import { WeatherDataService } from '../services/dataService';
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';
import { CheckCircle2, AlertTriangle, Layers, Grid, ShieldAlert, BarChart2, Info } from 'lucide-react';

export const VerificationPage: React.FC = () => {
  const [metricsData, setMetricsData] = useState<any>(null);
  const [fssThreshold, setFssThreshold] = useState<'50mm' | '10mm' | '100mm'>('50mm');

  useEffect(() => {
    WeatherDataService.getMetricsData().then((data) => {
      setMetricsData(data);
    });
  }, []);

  const categoryVerification = metricsData?.categoryVerification || [];
  const fssData = metricsData?.fssNeighborhoodScaling || [];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/30">
            <CheckCircle2 className="w-5 h-5" />
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">Extreme Event Verification & Spatial Skill</h2>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl">
          Scientific validation against severe class imbalance: Category-stratified performance metrics, sample size bounds, and scale-selective Fractions Skill Score (FSS) neighborhood evaluation.
        </p>
      </div>

      {/* Small Sample Warning Callout */}
      <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3 shadow-lg">
        <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
        <div className="text-xs text-amber-200 leading-relaxed">
          <strong className="text-white font-bold block mb-1">Statistical Sample Size Disclosure:</strong>
          Extreme rainfall events (&ge;115.6 mm) constitute only 1.4% (N=243) of all evaluated grid-day instances during the monsoon season. As dictated by NCMRWF verification standards, metrics on rare events carry wider confidence intervals and must be interpreted in conjunction with spatial neighborhood scores (FSS) rather than isolated point metrics.
        </div>
      </div>

      {/* Categorical Rainfall Verification Table */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="text-base font-bold text-white">Stratified Performance by Rainfall Intensity Category</h3>
            <p className="text-xs text-slate-400">IMD operational categories: No/Low, Moderate, Heavy, and Very Heavy/Extreme.</p>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
            SAMPLE GRID-DAY TOTAL: 17,415
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800 font-sans">
              <tr>
                <th className="p-3">Intensity Category</th>
                <th className="p-3">Rainfall Range</th>
                <th className="p-3 text-right">Sample Count (N)</th>
                <th className="p-3 text-right">Sample %</th>
                <th className="p-3 text-right">RMSE (B1 vs B4)</th>
                <th className="p-3 text-right">POD / Hit Rate</th>
                <th className="p-3 text-right">FAR / False Alarm</th>
                <th className="p-3 text-center">Data Reliability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {categoryVerification.map((cat: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-800/30">
                  <td className="p-3 font-sans font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm" style={{
                      backgroundColor: idx === 0 ? '#64748B' : idx === 1 ? '#22C55E' : idx === 2 ? '#EAB308' : '#EF4444'
                    }} />
                    {cat.category}
                  </td>
                  <td className="p-3 text-slate-400">{cat.rainfallRange}</td>
                  <td className="p-3 text-right text-slate-200">{cat.sampleCount.toLocaleString()}</td>
                  <td className="p-3 text-right text-slate-400">{cat.sampleRatioPct}%</td>
                  <td className="p-3 text-right">
                    <span className="text-slate-400 line-through mr-1.5">{cat.rmseB1}</span>
                    <span className="text-cyan-300 font-bold">{cat.rmseB4} mm</span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="text-slate-400 mr-1.5">{cat.podB1} →</span>
                    <span className="text-emerald-400 font-bold">{cat.podB4}</span>
                  </td>
                  <td className="p-3 text-right">
                    <span className="text-slate-400 mr-1.5">{cat.farB1} →</span>
                    <span className="text-cyan-300 font-bold">{cat.farB4}</span>
                  </td>
                  <td className="p-3 text-center font-sans">
                    {cat.sampleWarning ? (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-950 text-amber-300 border border-amber-800 flex items-center justify-center gap-1">
                        <AlertTriangle className="w-3 h-3" /> Rare Sample
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800">
                        Robust (N &gt; 1,000)
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Spatial Neighborhood Verification: Fractions Skill Score (FSS) */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Spatial Scale Verification: Fractions Skill Score (FSS)</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                ROBERTS & LEAN (2008)
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Evaluates model skill as spatial neighborhood size expands from grid scale (27 km) to regional scale (194 km).
            </p>
          </div>

          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs">
            <span className="text-slate-400 px-2">Threshold:</span>
            <button
              onClick={() => setFssThreshold('10mm')}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                fssThreshold === '10mm' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400'
              }`}
            >
              &gt; 10 mm
            </button>
            <button
              onClick={() => setFssThreshold('50mm')}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                fssThreshold === '50mm' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40' : 'text-slate-400'
              }`}
            >
              &gt; 50 mm (Heavy)
            </button>
            <button
              onClick={() => setFssThreshold('100mm')}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                fssThreshold === '100mm' ? 'bg-orange-500/20 text-orange-300 font-bold border border-orange-500/40' : 'text-slate-400'
              }`}
            >
              &gt; 100 mm (Extreme)
            </button>
          </div>
        </div>

        {/* FSS Line Chart */}
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={fssData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="neighborhood" stroke="#94A3B8" tick={{ fill: '#CBD5E1', fontSize: 11 }} />
              <YAxis stroke="#94A3B8" tick={{ fill: '#CBD5E1', fontSize: 11 }} domain={[0, 1]} label={{ value: 'FSS Score (0 to 1)', fill: '#94A3B8', fontSize: 10, angle: -90, position: 'insideLeft' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#F8FAFC',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
              <Line
                type="monotone"
                dataKey={fssThreshold === '10mm' ? 'fss10mmB1' : fssThreshold === '50mm' ? 'fss50mmB1' : 'fss100mmB1'}
                name="B1: Raw GFS Baseline"
                stroke="#64748B"
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Line
                type="monotone"
                dataKey={fssThreshold === '10mm' ? 'fss10mmB4' : fssThreshold === '50mm' ? 'fss50mmB4' : 'fss100mmB4'}
                name="B4: Regime-Aware AI Post-Processing"
                stroke="#22D3EE"
                strokeWidth={2.5}
                dot={{ r: 5, fill: '#22D3EE' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* FSS Formula & Explanation Box */}
        <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 text-xs text-slate-300 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-white">Why FSS is indispensable for NWP:</span>
            <span className="font-mono text-cyan-400">Formula: FSS = 1 - (MSE / MSE_ref)</span>
          </div>
          <p className="leading-relaxed">
            Conventional point-by-point verification suffers from the "double penalty" effect: when an intense rainfall event is predicted only 25 km away from where it falls, point verification penalizes the model twice (a false alarm at the predicted cell and a miss at the observed cell). FSS evaluates whether the fraction of rain events in a surrounding window ($3\times3, 5\times5, 7\times7$) matches observation, proving that Regime-Aware post-processing achieves operational utility at scales above ~80 km.
          </p>
        </div>
      </div>
    </div>
  );
};
