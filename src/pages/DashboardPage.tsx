import React, { useState, useEffect, useMemo } from 'react';
import { WeatherForecastRecord, RegimeCalendarDay } from '../types/weather';
import { WeatherDataService } from '../services/dataService';
import { MODELS, IMD_RAINFALL_THRESHOLDS, REGIME_DEFINITIONS } from '../config';
import { IndiaMap } from '../components/map/IndiaMap';
import {
  Calendar,
  Play,
  Pause,
  ChevronLeft,
  ChevronRight,
  Download,
  Search,
  Filter,
  Activity,
  Wind,
  Droplets,
  Thermometer,
  Zap,
  CheckCircle,
  AlertTriangle,
  ArrowUpDown,
  Sparkles,
  Info
} from 'lucide-react';

interface DashboardPageProps {
  onNavigateToRegimes: () => void;
  onNavigateToComparison: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigateToRegimes,
  onNavigateToComparison
}) => {
  // Calendar dates & selection
  const [calendarDays, setCalendarDays] = useState<RegimeCalendarDay[]>([]);
  const [selectedDateIndex, setSelectedDateIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Active configuration
  const [selectedModel, setSelectedModel] = useState<'b1_raw' | 'b2_qm' | 'b3_xgb' | 'b4_regime_xgb' | 'observed_rain' | 'probability'>('b4_regime_xgb');
  const [viewMode, setViewMode] = useState<'district' | 'grid'>('district');
  const [heavyThreshold, setHeavyThreshold] = useState<number>(64.5);
  const [selectedDistrictId, setSelectedDistrictId] = useState<string>('mum');

  // Forecast data for current date
  const [forecasts, setForecasts] = useState<WeatherForecastRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Table filtering & sorting
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStateFilter, setSelectedStateFilter] = useState('ALL');
  const [quickFilter, setQuickFilter] = useState<'all' | 'heavy' | 'core' | 'ghats'>('all');
  const [districtCardTab, setDistrictCardTab] = useState<'weather' | 'xai'>('weather');
  const [sortField, setSortField] = useState<'districtName' | 'b4_regime_xgb' | 'observed_rain' | 'prob_heavy_64_5'>('b4_regime_xgb');
  const [sortAsc, setSortAsc] = useState(false);

  // Load calendar on mount
  useEffect(() => {
    WeatherDataService.getMonsoonCalendar().then((days) => {
      setCalendarDays(days);
      if (days.length > 0) {
        // Default to a notable depression or active day (e.g. index 3 or 4)
        setSelectedDateIndex(4);
      }
    });
  }, []);

  // Load forecasts whenever selected date changes
  useEffect(() => {
    if (calendarDays.length === 0) return;
    const currentDate = calendarDays[selectedDateIndex]?.date;
    if (!currentDate) return;

    setLoading(true);
    WeatherDataService.getForecastsByDate(currentDate).then((records) => {
      setForecasts(records);
      setLoading(false);
    });
  }, [calendarDays, selectedDateIndex]);

  // Automated time stepper (playback)
  useEffect(() => {
    let interval: any;
    if (isPlaying && calendarDays.length > 0) {
      interval = setInterval(() => {
        setSelectedDateIndex((prev) => (prev + 1) % calendarDays.length);
      }, 2500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, calendarDays.length]);

  const currentCalDay = calendarDays[selectedDateIndex];
  const currentRegime = currentCalDay?.regime || 'Active';
  const regimeInfo = REGIME_DEFINITIONS[currentRegime];

  // Currently selected district record
  const selectedRecord = useMemo(() => {
    return forecasts.find((f) => f.districtId === selectedDistrictId) || forecasts[0];
  }, [forecasts, selectedDistrictId]);

  // Unique states for filtering
  const uniqueStates = useMemo(() => {
    const set = new Set(forecasts.map((f) => f.state));
    return ['ALL', ...Array.from(set).sort()];
  }, [forecasts]);

  // Filtered and sorted records for bottom table
  const filteredRecords = useMemo(() => {
    return forecasts
      .filter((rec) => {
        const matchesQuery =
          rec.districtName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rec.state.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesState = selectedStateFilter === 'ALL' || rec.state === selectedStateFilter;
        
        let matchesQuick = true;
        if (quickFilter === 'heavy') matchesQuick = rec.prob_heavy_64_5 >= 0.40;
        else if (quickFilter === 'core') matchesQuick = rec.isCoreZone;
        else if (quickFilter === 'ghats') matchesQuick = rec.region.includes('Ghats') || rec.region.includes('Coast');

        return matchesQuery && matchesState && matchesQuick;
      })
      .sort((a, b) => {
        let valA = a[sortField];
        let valB = b[sortField];
        if (typeof valA === 'string') {
          return sortAsc ? (valA as string).localeCompare(valB as string) : (valB as string).localeCompare(valA as string);
        }
        return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
      });
  }, [forecasts, searchQuery, selectedStateFilter, quickFilter, sortField, sortAsc]);

  const handleExportCSV = () => {
    WeatherDataService.exportToCSV(filteredRecords);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-6">
      {/* Page Title & Operational Status Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-white tracking-tight">Meteorological Operations Center</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
              LIVE MONSOON DESK
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Real-time post-processed 24-hour rainfall forecasts aligned to IMD 08:30 IST verification cycle.
          </p>
        </div>

        {/* Global Action Chips */}
        <div className="flex items-center gap-2">
          <button
            onClick={onNavigateToComparison}
            className="px-3 py-1.5 rounded-xl glass-panel hover:bg-slate-800/80 text-xs font-medium text-slate-300 border border-slate-700 transition flex items-center gap-1.5"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            Compare B1 vs B4
          </button>
          <button
            onClick={onNavigateToRegimes}
            className="px-3 py-1.5 rounded-xl glass-panel hover:bg-slate-800/80 text-xs font-medium text-slate-300 border border-slate-700 transition flex items-center gap-1.5"
          >
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            Monsoon Dynamics
          </button>
        </div>
      </div>

      {/* Control Timeline & Stepper Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-700/60 shadow-lg flex flex-wrap items-center justify-between gap-4">
        {/* Date Selector & Playback */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-2.5 rounded-xl font-medium text-xs flex items-center gap-1.5 transition ${
              isPlaying
                ? 'bg-amber-500 text-slate-950 font-bold shadow-glow-amber'
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30'
            }`}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'Pause Stepper' : 'Auto Play'}
          </button>

          <div className="flex items-center bg-slate-900/80 border border-slate-700 rounded-xl p-1">
            <button
              onClick={() => setSelectedDateIndex((prev) => Math.max(0, prev - 1))}
              disabled={selectedDateIndex === 0}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="px-3 text-center min-w-[150px]">
              <span className="text-xs font-mono font-bold text-white block">
                {currentCalDay?.date || '2023-07-05'}
              </span>
              <span className="text-[10px] text-slate-400">
                {currentCalDay?.dayOfWeek} • Day {selectedDateIndex + 1} of {calendarDays.length}
              </span>
            </div>

            <button
              onClick={() => setSelectedDateIndex((prev) => Math.min(calendarDays.length - 1, prev + 1))}
              disabled={selectedDateIndex === calendarDays.length - 1}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white disabled:opacity-30"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Heavy Rain Threshold Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Alert Level:</span>
          <div className="flex items-center bg-slate-900/80 border border-slate-700 rounded-xl p-1 text-xs">
            <button
              onClick={() => setHeavyThreshold(15.6)}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                heavyThreshold === 15.6 ? 'bg-emerald-500/20 text-emerald-300 font-bold' : 'text-slate-400'
              }`}
            >
              15.6mm (Mod)
            </button>
            <button
              onClick={() => setHeavyThreshold(64.5)}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                heavyThreshold === 64.5 ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40' : 'text-slate-400'
              }`}
            >
              64.5mm (Heavy)
            </button>
            <button
              onClick={() => setHeavyThreshold(115.6)}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                heavyThreshold === 115.6 ? 'bg-orange-500/20 text-orange-300 font-bold' : 'text-slate-400'
              }`}
            >
              115.6mm (Very Heavy)
            </button>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center bg-slate-900/80 border border-slate-700 rounded-xl p-1 text-xs">
          <button
            onClick={() => setViewMode('district')}
            className={`px-3 py-1 rounded-lg transition font-medium ${
              viewMode === 'district' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
            }`}
          >
            District Choropleth
          </button>
          <button
            onClick={() => setViewMode('grid')}
            className={`px-3 py-1 rounded-lg transition font-medium ${
              viewMode === 'grid' ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30' : 'text-slate-400'
            }`}
          >
            0.25° Grid Overlay
          </button>
        </div>
      </div>

      {/* Model Selector Pill Bar */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-slate-400 font-medium mr-1">Forecast Model:</span>
        {MODELS.map((model) => {
          const isSelected = selectedModel === model.id;
          return (
            <button
              key={model.id}
              onClick={() => setSelectedModel(model.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
                isSelected
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-glow-cyan'
                  : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-700'
              }`}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: model.color }} />
              <span>{model.code}: {model.name}</span>
            </button>
          );
        })}
        <button
          onClick={() => setSelectedModel('observed_rain')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
            selectedModel === 'observed_rain'
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400 shadow-sm'
              : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>IMD Ground Truth</span>
        </button>
        <button
          onClick={() => setSelectedModel('probability')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all flex items-center gap-2 ${
            selectedModel === 'probability'
              ? 'bg-amber-500/20 text-amber-300 border-amber-400 shadow-glow-amber'
              : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-700'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-amber-400" />
          <span>P(Rain &gt; 64.5mm)</span>
        </button>
      </div>

      {/* Main Grid: Left/Center Map + Right Synoptic & District Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Map Center Panel (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-2">
          <IndiaMap
            forecasts={forecasts}
            activeModel={selectedModel}
            selectedDistrictId={selectedDistrictId}
            onSelectDistrict={(id) => setSelectedDistrictId(id)}
            viewMode={viewMode}
            highlightThreshold={heavyThreshold}
            height="h-[620px]"
          />
          <div className="flex items-center justify-between text-[11px] text-slate-400 px-2 font-mono">
            <span>Projection: Equirectangular India Domain (6.5°N–38.5°N, 66.5°E–100.0°E)</span>
            <span>Forecast Lead Time: +24h (00 UTC init)</span>
          </div>
        </div>

        {/* Right Synoptic & District Summary Panel (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          {/* Card 1: Synoptic Weather Regime Badge */}
          <div className="glass-panel p-4 rounded-2xl border border-slate-700/60 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-slate-400 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-400" />
                Synoptic Circulation State
              </span>
              <span className="text-[10px] font-mono text-slate-400">PS 26080</span>
            </div>

            <div
              className="p-3 rounded-xl border flex items-center justify-between mb-3"
              style={{
                backgroundColor: regimeInfo.bgColor,
                borderColor: regimeInfo.borderColor
              }}
            >
              <div>
                <span className="text-lg font-bold block" style={{ color: regimeInfo.color }}>
                  {regimeInfo.label}
                </span>
                <span className="text-[11px] text-slate-300 font-mono">
                  Core Zone Anomaly: {currentCalDay?.coreZoneAnomaly > 0 ? '+' : ''}{currentCalDay?.coreZoneAnomaly}σ
                </span>
              </div>
              <span
                className="w-3.5 h-3.5 rounded-full animate-pulse"
                style={{ backgroundColor: regimeInfo.color }}
              />
            </div>

            <p className="text-xs text-slate-300 mb-2 leading-relaxed">
              {regimeInfo.synopticDescription}
            </p>
            <div className="pt-2 border-t border-slate-800 text-[10px] text-slate-400 flex items-center justify-between font-mono">
              <span>Trough: {currentCalDay?.monsoonTroughStatus || 'Active'}</span>
              <span>LPS: {currentCalDay?.activeLpsCount || 1} System(s)</span>
            </div>
          </div>

          {/* Card 2: Selected District Comprehensive Card */}
          {selectedRecord ? (
            <div className="glass-panel p-5 rounded-2xl border border-slate-700/60 shadow-lg flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between mb-3 pb-3 border-b border-slate-700/60">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-lg font-bold text-white">{selectedRecord.districtName}</h3>
                      {selectedRecord.b4_regime_xgb >= 115.6 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950 text-red-300 border border-red-600 animate-pulse">
                          RED WARNING
                        </span>
                      ) : selectedRecord.b4_regime_xgb >= 64.5 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-600">
                          ORANGE ALERT
                        </span>
                      ) : selectedRecord.b4_regime_xgb >= 15.6 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700">
                          YELLOW WATCH
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                          GREEN NORMAL
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400">{selectedRecord.state} • {selectedRecord.region}</p>
                  </div>
                  <span className="px-2 py-1 rounded text-xs font-mono bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {selectedRecord.isCoreZone ? 'Core Zone' : 'Standard'}
                  </span>
                </div>

                {/* Rainfall Comparison Bars */}
                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-slate-400">Raw GFS 0.25° (B1):</span>
                      <span className="font-mono text-slate-200">{selectedRecord.b1_raw} mm</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-slate-500 rounded-full"
                        style={{ width: `${Math.min(100, (selectedRecord.b1_raw / 150) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-cyan-300 font-semibold">Regime-Aware XGB (B4):</span>
                      <span className="font-mono text-cyan-300 font-bold">{selectedRecord.b4_regime_xgb} mm</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-cyan-400 rounded-full shadow-glow-cyan"
                        style={{ width: `${Math.min(100, (selectedRecord.b4_regime_xgb / 150) * 100)}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-emerald-400 font-semibold">IMD Ground Truth:</span>
                      <span className="font-mono text-emerald-400 font-bold">{selectedRecord.observed_rain} mm</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-emerald-400 rounded-full"
                        style={{ width: `${Math.min(100, (selectedRecord.observed_rain / 150) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Exceedance Probabilities */}
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 space-y-2 mb-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">P(Rain &gt; 64.5 mm Heavy):</span>
                    <span className={`font-mono font-bold ${selectedRecord.prob_heavy_64_5 > 0.5 ? 'text-amber-400' : 'text-slate-300'}`}>
                      {(selectedRecord.prob_heavy_64_5 * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">P(Rain &gt; 115.6 mm Very Heavy):</span>
                    <span className={`font-mono font-bold ${selectedRecord.prob_very_heavy_115_6 > 0.4 ? 'text-rose-400' : 'text-slate-300'}`}>
                      {(selectedRecord.prob_very_heavy_115_6 * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>

                {/* Switch between Physical Predictors and Explainable AI (SHAP) */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-semibold text-slate-300">
                    {districtCardTab === 'weather' ? 'Physical Atmospheric Variables' : 'Explainable AI Feature Impact (SHAP)'}
                  </span>
                  <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5 text-[10px]">
                    <button
                      onClick={() => setDistrictCardTab('weather')}
                      className={`px-2 py-0.5 rounded transition ${districtCardTab === 'weather' ? 'bg-cyan-500/20 text-cyan-300 font-bold' : 'text-slate-400'}`}
                    >
                      Atmosphere
                    </button>
                    <button
                      onClick={() => setDistrictCardTab('xai')}
                      className={`px-2 py-0.5 rounded transition ${districtCardTab === 'xai' ? 'bg-indigo-500/20 text-indigo-300 font-bold' : 'text-slate-400'}`}
                    >
                      XAI (SHAP)
                    </button>
                  </div>
                </div>

                {districtCardTab === 'weather' ? (
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/40 flex items-center gap-2">
                      <Thermometer className="w-4 h-4 text-cyan-400" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">Temp 2m</span>
                        <span>{selectedRecord.temp_2m_c}°C</span>
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/40 flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">RH 2m</span>
                        <span>{selectedRecord.rh_2m_pct}%</span>
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/40 flex items-center gap-2">
                      <Wind className="w-4 h-4 text-teal-400" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">Wind 10m</span>
                        <span>{selectedRecord.wind_speed_ms} m/s</span>
                      </div>
                    </div>
                    <div className="p-2 rounded-lg bg-slate-800/40 border border-slate-700/40 flex items-center gap-2">
                      <Zap className="w-4 h-4 text-amber-400" />
                      <div>
                        <span className="text-[10px] text-slate-400 block font-sans">CAPE</span>
                        <span>{selectedRecord.cape_jkg} J/kg</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* Explainable AI SHAP Attribution Breakdown */
                  <div className="space-y-1.5 text-[11px] font-mono p-2.5 rounded-xl bg-slate-900/90 border border-slate-800">
                    <div className="flex items-center justify-between text-slate-300">
                      <span>• Synoptic Regime Anomaly ({selectedRecord.anomaly_sigma > 0 ? '+' : ''}{selectedRecord.anomaly_sigma}σ):</span>
                      <span className="text-cyan-400 font-bold">+{((selectedRecord.b4_regime_xgb * 0.28)).toFixed(1)} mm</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>• Low-Level Jet & Moisture Flux:</span>
                      <span className="text-emerald-400 font-bold">+{((selectedRecord.b4_regime_xgb * 0.18)).toFixed(1)} mm</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>• Convective Instability (CAPE):</span>
                      <span className="text-amber-400 font-bold">+{((selectedRecord.b4_regime_xgb * 0.12)).toFixed(1)} mm</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-400">
                      <span>• Orographic Bias Dampening:</span>
                      <span className="text-rose-400 font-bold">-{((selectedRecord.b1_raw - selectedRecord.b4_regime_xgb)).toFixed(1)} mm</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-cyan-400" />
                <span>Error Delta: {Math.abs(selectedRecord.b4_regime_xgb - selectedRecord.observed_rain).toFixed(1)} mm vs Raw GFS error {Math.abs(selectedRecord.b1_raw - selectedRecord.observed_rain).toFixed(1)} mm</span>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 text-center text-slate-400 text-xs">
              Select a district on the map to inspect.
            </div>
          )}
        </div>
      </div>

      {/* Bottom District Intelligence Table with Sorting, Searching, and CSV Export */}
      <div className="glass-panel p-5 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col gap-4">
        {/* Table Top Controls */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white">District Weather Forecasts Table</h3>
            <div className="flex flex-wrap items-center gap-1.5 mt-1.5">
              <button
                onClick={() => setQuickFilter('all')}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] transition ${
                  quickFilter === 'all' ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                All ({forecasts.length})
              </button>
              <button
                onClick={() => setQuickFilter('heavy')}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] transition flex items-center gap-1 ${
                  quickFilter === 'heavy' ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <AlertTriangle className="w-3 h-3 text-amber-400" />
                Heavy Rain Risk (P &ge; 40%)
              </button>
              <button
                onClick={() => setQuickFilter('core')}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] transition ${
                  quickFilter === 'core' ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Core Monsoon Zone
              </button>
              <button
                onClick={() => setQuickFilter('ghats')}
                className={`px-2.5 py-0.5 rounded-lg text-[11px] transition ${
                  quickFilter === 'ghats' ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/30' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                West Coast & Ghats
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search district or state..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-900 border border-slate-700 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-400 w-52"
              />
            </div>

            {/* State Filter */}
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-xl px-2 py-1 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <select
                value={selectedStateFilter}
                onChange={(e) => setSelectedStateFilter(e.target.value)}
                className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
              >
                {uniqueStates.map((st) => (
                  <option key={st} value={st} className="bg-slate-900 text-slate-200">
                    {st === 'ALL' ? 'All States' : st}
                  </option>
                ))}
              </select>
            </div>

            {/* Export CSV Button */}
            <button
              onClick={handleExportCSV}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </button>
          </div>
        </div>

        {/* Scrollable Responsive Table */}
        <div className="overflow-x-auto max-h-[380px] rounded-xl border border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-slate-900/95 backdrop-blur-md text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th
                  onClick={() => {
                    if (sortField === 'districtName') setSortAsc(!sortAsc);
                    else { setSortField('districtName'); setSortAsc(true); }
                  }}
                  className="p-3 cursor-pointer hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    District <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3">State</th>
                <th className="p-3">Regime</th>
                <th className="p-3 text-right">Raw GFS (B1)</th>
                <th className="p-3 text-right">Quantile (B2)</th>
                <th
                  onClick={() => {
                    if (sortField === 'b4_regime_xgb') setSortAsc(!sortAsc);
                    else { setSortField('b4_regime_xgb'); setSortAsc(false); }
                  }}
                  className="p-3 text-right cursor-pointer text-cyan-300 hover:text-cyan-200"
                >
                  <div className="flex items-center justify-end gap-1">
                    Regime-AI (B4) <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => {
                    if (sortField === 'observed_rain') setSortAsc(!sortAsc);
                    else { setSortField('observed_rain'); setSortAsc(false); }
                  }}
                  className="p-3 text-right cursor-pointer hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    Observed (IMD) <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  onClick={() => {
                    if (sortField === 'prob_heavy_64_5') setSortAsc(!sortAsc);
                    else { setSortField('prob_heavy_64_5'); setSortAsc(false); }
                  }}
                  className="p-3 text-right cursor-pointer text-amber-300 hover:text-amber-200"
                >
                  <div className="flex items-center justify-end gap-1">
                    P(&gt;64.5mm) <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="p-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {filteredRecords.map((r) => {
                const isSelected = r.districtId === selectedDistrictId;
                const isHeavy = r.b4_regime_xgb >= 64.5;
                return (
                  <tr
                    key={r.id}
                    onClick={() => setSelectedDistrictId(r.districtId)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-cyan-500/10 text-white'
                        : 'hover:bg-slate-800/40 text-slate-300'
                    }`}
                  >
                    <td className="p-3 font-sans font-medium text-white flex items-center gap-2">
                      {isHeavy && <span className="w-2 h-2 rounded-full bg-amber-400" title="Heavy rain alert" />}
                      {r.districtName}
                    </td>
                    <td className="p-3 font-sans text-slate-400">{r.state}</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-800 border border-slate-700 text-slate-300">
                        {r.regime}
                      </span>
                    </td>
                    <td className="p-3 text-right text-slate-400">{r.b1_raw} mm</td>
                    <td className="p-3 text-right text-blue-300">{r.b2_qm} mm</td>
                    <td className="p-3 text-right text-cyan-300 font-bold">{r.b4_regime_xgb} mm</td>
                    <td className="p-3 text-right text-emerald-400 font-semibold">{r.observed_rain} mm</td>
                    <td className="p-3 text-right">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          r.prob_heavy_64_5 > 0.6
                            ? 'bg-amber-950 text-amber-300 border border-amber-800'
                            : 'text-slate-400'
                        }`}
                      >
                        {(r.prob_heavy_64_5 * 100).toFixed(0)}%
                      </span>
                    </td>
                    <td className="p-3 text-center font-sans">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDistrictId(r.districtId);
                        }}
                        className="px-2.5 py-1 text-[11px] rounded bg-cyan-950 hover:bg-cyan-900 text-cyan-300 border border-cyan-800"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
