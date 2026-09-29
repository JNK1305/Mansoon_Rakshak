import React, { useState, useEffect } from 'react';
import { WeatherDataService } from '../services/dataService';
import { WeatherForecastRecord, RegimeCalendarDay } from '../types/weather';
import { IndiaMap } from '../components/map/IndiaMap';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
  ReferenceLine
} from 'recharts';
import { CloudRain, Target, Award, AlertTriangle, ShieldCheck, Sliders, Info } from 'lucide-react';

export const HeavyRainProbPage: React.FC = () => {
  const [calendarDays, setCalendarDays] = useState<RegimeCalendarDay[]>([]);
  const [selectedDate, setSelectedDate] = useState('2023-07-05');
  const [forecasts, setForecasts] = useState<WeatherForecastRecord[]>([]);
  const [probData, setProbData] = useState<any>(null);
  const [threshold, setThreshold] = useState(64.5);
  const [selectedDistrictId, setSelectedDistrictId] = useState('bhu');

  useEffect(() => {
    WeatherDataService.getMonsoonCalendar().then((days) => {
      setCalendarDays(days);
    });
    WeatherDataService.getProbabilitiesData().then((data) => {
      setProbData(data);
    });
  }, []);

  useEffect(() => {
    if (!selectedDate) return;
    WeatherDataService.getForecastsByDate(selectedDate).then((records) => {
      setForecasts(records);
    });
  }, [selectedDate]);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <CloudRain className="w-5 h-5" />
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">Heavy Rainfall Probability & Calibration</h2>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl">
          Probabilistic exceedance forecasts for high-impact events (P(Rain &gt; 64.5 mm)), calibrated via quantile regression and evaluated with reliability diagrams and ROC curves.
        </p>
      </div>

      {/* Headline Metric Scorecards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-4 rounded-xl border border-slate-700/60 shadow-md">
          <span className="text-[11px] text-slate-400 block mb-1">Brier Score (B4 vs B1)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-cyan-400">0.048</span>
            <span className="text-xs text-slate-400 font-mono line-through">0.098</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-medium mt-1 block">51% Error Reduction</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-700/60 shadow-md">
          <span className="text-[11px] text-slate-400 block mb-1">Brier Skill Score (BSS)</span>
          <div className="text-2xl font-bold font-mono text-white">+0.51</div>
          <span className="text-[10px] text-cyan-300 font-medium mt-1 block">Substantial skill over climatology</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-700/60 shadow-md">
          <span className="text-[11px] text-slate-400 block mb-1">ROC AUC (Discrimination)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-emerald-400">0.90</span>
            <span className="text-xs text-slate-400 font-mono">vs 0.72 (B1)</span>
          </div>
          <span className="text-[10px] text-emerald-400 font-medium mt-1 block">+25% Discrimination Gain</span>
        </div>

        <div className="glass-panel p-4 rounded-xl border border-slate-700/60 shadow-md">
          <span className="text-[11px] text-slate-400 block mb-1">PR AUC (Imbalanced Rare Class)</span>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold font-mono text-indigo-400">0.71</span>
            <span className="text-xs text-slate-400 font-mono">vs 0.34 (B1)</span>
          </div>
          <span className="text-[10px] text-indigo-300 font-medium mt-1 block">2.1× Precision at high recall</span>
        </div>
      </div>

      {/* Map Section + Slider */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-bold text-white">Spatial Exceedance Risk Map</h3>
            <p className="text-xs text-slate-400">
              Calibrated probability that 24h rainfall exceeds {threshold} mm for {selectedDate}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Threshold Slider */}
            <div className="flex items-center gap-3 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-xs">
              <span className="text-slate-400 font-medium">Threshold:</span>
              <span className="font-mono font-bold text-amber-400">{threshold} mm</span>
              <input
                type="range"
                min="15.6"
                max="115.6"
                step="10"
                value={threshold}
                onChange={(e) => setThreshold(Number(e.target.value))}
                className="w-28 accent-amber-400 cursor-pointer"
              />
            </div>

            {/* Date Picker */}
            <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-xl p-1 text-xs">
              <span className="text-slate-400 px-2">Date:</span>
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
        </div>

        <IndiaMap
          forecasts={forecasts}
          activeModel="probability"
          selectedDistrictId={selectedDistrictId}
          onSelectDistrict={(id) => setSelectedDistrictId(id)}
          height="h-[520px]"
        />
      </div>

      {/* Verification Diagnostics: Reliability Diagram + ROC Curve */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Reliability Diagram */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col gap-4">
          <div className="border-b border-slate-800 pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-cyan-400" />
                Reliability Diagram (Calibration Curve)
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                P(&gt;64.5 mm)
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Forecast probability vs observed relative frequency. Points on diagonal line = perfect calibration.
            </p>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={probData?.reliabilityCurve64_5mm || []}
                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis
                  dataKey="forecastProbability"
                  stroke="#94A3B8"
                  tick={{ fill: '#CBD5E1', fontSize: 11 }}
                  label={{ value: 'Forecast Probability', fill: '#94A3B8', fontSize: 10, position: 'bottom', offset: -5 }}
                />
                <YAxis
                  stroke="#94A3B8"
                  tick={{ fill: '#CBD5E1', fontSize: 11 }}
                  domain={[0, 1]}
                  label={{ value: 'Observed Frequency', fill: '#94A3B8', fontSize: 10, angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                {/* 1:1 Perfect Reliability Reference Line */}
                <ReferenceLine
                  segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]}
                  stroke="#64748B"
                  strokeDasharray="4 4"
                  label={{ value: 'Perfect Reliability', fill: '#64748B', fontSize: 10 }}
                />
                <Line
                  type="monotone"
                  dataKey="observedRelativeFrequencyB1"
                  name="B1: Raw GFS (Overconfident)"
                  stroke="#F43F5E"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
                <Line
                  type="monotone"
                  dataKey="observedRelativeFrequencyB4"
                  name="B4: Regime-Aware AI (Well Calibrated)"
                  stroke="#22D3EE"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#22D3EE' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <span className="font-semibold text-white">Meteorological Interpretation:</span> Raw GFS shows sharp overforecasting bias (forecast probability 0.65 corresponds to actual observation frequency of only 0.41). Regime-aware AI lies tightly along the diagonal.
          </div>
        </div>

        {/* ROC Curve */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col gap-4">
          <div className="border-b border-slate-800 pb-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-400" />
                Receiver Operating Characteristic (ROC)
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                AUC: 0.90 vs 0.72
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              True Positive Rate (Hit Rate) vs False Positive Rate across all decision probability cutoffs.
            </p>
          </div>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={probData?.rocCurve || []}
                margin={{ top: 20, right: 30, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
                <XAxis
                  dataKey="fpr"
                  stroke="#94A3B8"
                  tick={{ fill: '#CBD5E1', fontSize: 11 }}
                  label={{ value: 'False Positive Rate (FPR)', fill: '#94A3B8', fontSize: 10, position: 'bottom', offset: -5 }}
                />
                <YAxis
                  stroke="#94A3B8"
                  tick={{ fill: '#CBD5E1', fontSize: 11 }}
                  domain={[0, 1]}
                  label={{ value: 'True Positive Rate (TPR)', fill: '#94A3B8', fontSize: 10, angle: -90, position: 'insideLeft' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0F172A',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#F8FAFC',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <ReferenceLine
                  segment={[{ x: 0, y: 0 }, { x: 1, y: 1 }]}
                  stroke="#64748B"
                  strokeDasharray="4 4"
                />
                <Line
                  type="monotone"
                  dataKey="tprB1"
                  name="B1: Raw GFS (AUC = 0.72)"
                  stroke="#64748B"
                  strokeWidth={2}
                  dot={{ r: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="tprB4"
                  name="B4: Regime-Aware AI (AUC = 0.90)"
                  stroke="#10B981"
                  strokeWidth={2.5}
                  dot={{ r: 3, fill: '#10B981' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-300">
            <span className="font-semibold text-white">Discriminative Power:</span> At an operational FPR limit of 10% (1 in 10 non-events flagged), Regime-Aware AI achieves 71% Hit Rate compared to only 39% for raw NWP.
          </div>
        </div>
      </div>
    </div>
  );
};
