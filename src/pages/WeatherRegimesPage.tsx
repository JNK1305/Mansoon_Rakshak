import React, { useState, useEffect } from 'react';
import { WeatherDataService } from '../services/dataService';
import { RegimeCalendarDay } from '../types/weather';
import { REGIME_DEFINITIONS } from '../config';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ReferenceLine } from 'recharts';
import { Activity, BookOpen, Layers, GitCompare, Calendar, ArrowRight, ShieldCheck } from 'lucide-react';

export const WeatherRegimesPage: React.FC = () => {
  const [calendarDays, setCalendarDays] = useState<RegimeCalendarDay[]>([]);
  const [regimesData, setRegimesData] = useState<any>(null);
  const [selectedDay, setSelectedDay] = useState<RegimeCalendarDay | null>(null);

  useEffect(() => {
    WeatherDataService.getMonsoonCalendar().then((days) => {
      setCalendarDays(days);
      if (days.length > 0) setSelectedDay(days[4]);
    });
    WeatherDataService.getRegimesData().then((data) => {
      setRegimesData(data);
    });
  }, []);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            <Activity className="w-5 h-5" />
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">Weather Regimes & Monsoon Dynamics</h2>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl">
          Core innovation of SIH PS 26080: Classifying large-scale synoptic circulation regimes over the Core Monsoon Zone (21°–27°N, 73°–82°E) to condition ML post-processing.
        </p>
      </div>

      {/* 4 Regime Definition Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Object.entries(REGIME_DEFINITIONS).map(([key, def]) => (
          <div
            key={key}
            className="glass-panel p-5 rounded-2xl border transition-all hover:scale-[1.02] shadow-xl flex flex-col justify-between"
            style={{ borderColor: `${def.borderColor}50` }}
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold" style={{ color: def.color }}>
                  {def.label}
                </span>
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: def.color }}
                />
              </div>

              <div className="mb-3">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                  Scientific Criteria
                </span>
                <p className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-900/60 p-2 rounded-lg border border-slate-800">
                  {def.criteria}
                </p>
              </div>

              <div className="mb-4">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-1">
                  Synoptic Characteristics
                </span>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {def.synopticDescription}
                </p>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-800 text-[10px] text-slate-500 flex items-center gap-1">
              <BookOpen className="w-3 h-3 text-slate-400" />
              <span>{def.citation}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Core Monsoon Zone Anomaly Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">Core Monsoon Zone Normalized Rainfall Anomaly Series</h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                CRITERIA: ±1.0σ THRESHOLD
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Normalized daily rainfall anomaly computed across 21°N–27°N, 73°E–82°E relative to IMD 1901–2020 climatology.
            </p>
          </div>
        </div>

        <div className="w-full h-72">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={calendarDays} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" />
              <XAxis dataKey="date" stroke="#94A3B8" tick={{ fill: '#CBD5E1', fontSize: 11 }} />
              <YAxis stroke="#94A3B8" tick={{ fill: '#CBD5E1', fontSize: 11 }} unit="σ" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '12px',
                  color: '#F8FAFC',
                  fontSize: '12px'
                }}
              />
              <ReferenceLine y={1.0} stroke="#10B981" strokeDasharray="4 4" label={{ value: 'Active Threshold (+1.0σ)', fill: '#10B981', fontSize: 10, position: 'right' }} />
              <ReferenceLine y={-1.0} stroke="#F59E0B" strokeDasharray="4 4" label={{ value: 'Break Threshold (-1.0σ)', fill: '#F59E0B', fontSize: 10, position: 'right' }} />
              <ReferenceLine y={0.0} stroke="#475569" />
              <Line
                type="monotone"
                dataKey="coreZoneAnomaly"
                name="Core Zone Anomaly (σ)"
                stroke="#22D3EE"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#22D3EE' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Calendar Heatmap & Interactive Inspection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Heatmap Grid (2 cols) */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col gap-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                Monsoon Season Timeline Heatmap
              </h3>
              <p className="text-xs text-slate-400">Click any date block to inspect synoptic parameters.</p>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-emerald-500"></span> Active</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-purple-500"></span> Depression</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-amber-500"></span> Break</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded bg-slate-600"></span> Other</span>
            </div>
          </div>

          {/* Grid of days */}
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-2">
            {calendarDays.map((d) => {
              const def = REGIME_DEFINITIONS[d.regime];
              const isSelected = selectedDay?.date === d.date;
              return (
                <div
                  key={d.date}
                  onClick={() => setSelectedDay(d)}
                  className={`p-2 rounded-xl cursor-pointer border transition-all text-center ${
                    isSelected
                      ? 'ring-2 ring-cyan-400 scale-105 z-10'
                      : 'hover:scale-105'
                  }`}
                  style={{
                    backgroundColor: def.bgColor,
                    borderColor: isSelected ? '#22D3EE' : def.borderColor
                  }}
                >
                  <span className="block text-[11px] font-bold text-white">{d.date.slice(5)}</span>
                  <span className="block text-[10px] font-mono mt-0.5" style={{ color: def.color }}>
                    {d.regime === 'Depression/Low' ? 'Depr' : d.regime}
                  </span>
                  <span className="block text-[9px] text-slate-400 font-mono">
                    {d.coreZoneAnomaly > 0 ? '+' : ''}{d.coreZoneAnomaly}σ
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Synoptic Inspector (1 col) */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 block mb-2">
              Synoptic Event Detail
            </span>
            {selectedDay ? (
              <div className="space-y-4">
                <div>
                  <h4 className="text-xl font-bold text-white">{selectedDay.date}</h4>
                  <span className="text-xs text-slate-400">{selectedDay.dayOfWeek} • Season JJAS</span>
                </div>

                <div
                  className="p-3 rounded-xl border flex items-center justify-between"
                  style={{
                    backgroundColor: REGIME_DEFINITIONS[selectedDay.regime].bgColor,
                    borderColor: REGIME_DEFINITIONS[selectedDay.regime].borderColor
                  }}
                >
                  <div>
                    <span className="text-sm font-bold block" style={{ color: REGIME_DEFINITIONS[selectedDay.regime].color }}>
                      {selectedDay.regime}
                    </span>
                    <span className="text-[11px] text-slate-300 font-mono">
                      Anomaly: {selectedDay.coreZoneAnomaly > 0 ? '+' : ''}{selectedDay.coreZoneAnomaly}σ
                    </span>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 text-slate-200">
                    Mean Rain: {selectedDay.allIndiaMeanRainfallMm} mm
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div>
                    <span className="text-slate-400 block">Monsoon Trough Alignment:</span>
                    <span className="text-slate-200 font-medium">{selectedDay.monsoonTroughStatus}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">Active Low Pressure Systems:</span>
                    <span className="font-mono text-cyan-300 font-bold">{selectedDay.activeLpsCount} system(s) in Indian basin</span>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400">Select any date to view synoptic diagnostic.</p>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Validated with IMD Pune Synoptic Charts</span>
          </div>
        </div>
      </div>
    </div>
  );
};
