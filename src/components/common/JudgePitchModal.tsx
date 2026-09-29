import React from 'react';
import { X, Sparkles, TrendingUp, Activity, CheckCircle2, ShieldCheck, ArrowRight, Download, Award, Cpu } from 'lucide-react';
import { PageId } from '../layout/Navbar';

interface JudgePitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: PageId) => void;
}

export const JudgePitchModal: React.FC<JudgePitchModalProps> = ({ isOpen, onClose, onNavigate }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-panel border border-cyan-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl bg-[#0B1322]/95 text-slate-100 flex flex-col gap-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="flex flex-col gap-2 border-b border-slate-800 pb-4 pr-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center gap-1.5 shadow-glow-cyan">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              SIH PROBLEM STATEMENT 26080
            </span>
            <span className="text-xs text-slate-400 font-mono">Ministry of Earth Sciences / NCMRWF</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            30-Second Executive Pitch for Judges & Evaluators
          </h2>
          <p className="text-xs text-slate-300 leading-relaxed">
            Regime-Aware AI Post-Processing of Monsoon Rainfall Forecasts: Closing the gap between numerical weather simulation and real-world ground observations.
          </p>
        </div>

        {/* 4-Step Narrative Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Box 1: The Problem */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-red-500/20 shadow-md">
            <div className="flex items-center gap-2 text-red-400 font-bold text-sm mb-2">
              <span className="w-6 h-6 rounded-lg bg-red-500/10 flex items-center justify-center text-xs font-mono border border-red-500/30">1</span>
              The Operational Problem
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Raw Numerical Weather Prediction (NWP) forecasts like <strong className="text-white">NOAA GFS</strong> exhibit severe systematic errors during the Indian monsoon: a <strong className="text-red-300 font-semibold">systemic wet bias (+28% to +45%)</strong> over the Western Ghats and spatial displacement of heavy convective rainfall cores along monsoon depression tracks.
            </p>
          </div>

          {/* Box 2: The Core Innovation */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-cyan-500/30 shadow-md">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-sm mb-2">
              <span className="w-6 h-6 rounded-lg bg-cyan-500/10 flex items-center justify-center text-xs font-mono border border-cyan-500/30">2</span>
              Our Regime-Aware Innovation
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard generic ML treats all days identically, washing out extreme convective rainfall. We classify <strong className="text-cyan-300 font-semibold">synoptic circulation regimes</strong> (Active, Break, and Depression) using normalized anomaly indexing over the Core Monsoon Zone (21°–27°N, 73°–82°E), dynamically conditioning gradient-boosted trees (XGBoost).
            </p>
          </div>

          {/* Box 3: Verification & Ground Truth */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-emerald-500/30 shadow-md">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/10 flex items-center justify-center text-xs font-mono border border-emerald-500/30">3</span>
              Verified Against IMD 0.25° NetCDF
            </div>
            <ul className="text-xs text-slate-300 space-y-1 font-mono">
              <li>• <strong className="text-white">RMSE Reduction:</strong> 19.8 mm → 14.2 mm (-28.4%)</li>
              <li>• <strong className="text-emerald-300">CSI at 50mm Threshold:</strong> +68.4% gain</li>
              <li>• <strong className="text-emerald-300">False Alarm Ratio (FAR):</strong> Reduced by 39%</li>
              <li>• <strong className="text-white">Reliability Brier Score:</strong> 0.048 (calibrated)</li>
            </ul>
          </div>

          {/* Box 4: Impact on Disaster Management */}
          <div className="p-5 rounded-2xl bg-slate-900/80 border border-indigo-500/30 shadow-md">
            <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm mb-2">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/10 flex items-center justify-center text-xs font-mono border border-indigo-500/30">4</span>
              Real-World Operational Impact
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              State and district disaster authorities (SDMA / DDMA) receive <strong className="text-indigo-300 font-semibold">calibrated exceedance probabilities</strong> for &gt;64.5 mm (Heavy) and &gt;115.6 mm (Very Heavy) rain 24h ahead, enabling targeted evacuations and flood reservoir release management without false panic.
            </p>
          </div>
        </div>

        {/* Action Shortcuts */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onNavigate('model-comparison');
              }}
              className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-glow-cyan transition"
            >
              <TrendingUp className="w-3.5 h-3.5" />
              View B1–B4 Benchmark
            </button>
            <button
              onClick={() => {
                onClose();
                onNavigate('dashboard');
              }}
              className="px-4 py-2 rounded-xl glass-panel hover:bg-slate-800 text-slate-200 font-semibold text-xs border border-slate-700 transition flex items-center gap-1.5"
            >
              <Activity className="w-3.5 h-3.5 text-cyan-400" />
              Open Operations Map
            </button>
          </div>

          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Strict zero-leakage temporal split (2020-22 Train / 2024 Test)</span>
          </div>
        </div>
      </div>
    </div>
  );
};
