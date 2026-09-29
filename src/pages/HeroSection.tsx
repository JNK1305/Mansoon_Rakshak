import React from 'react';
import { ArrowRight, Compass, ShieldAlert, GitFork, Activity, CloudRain, CheckCircle, TrendingUp, Sparkles, Layers } from 'lucide-react';
import { PageId } from '../components/layout/Navbar';

interface HeroSectionProps {
  onNavigate: (page: PageId) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <div className="relative w-full min-h-[90vh] flex flex-col justify-center items-center px-4 py-16 overflow-hidden">
      {/* Animated Rain Streaks Simulation in Hero */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        {[...Array(24)].map((_, i) => (
          <div
            key={i}
            className="rain-streak"
            style={{
              left: `${(i * 4.2) % 100}%`,
              top: `${(i * 17) % 80}px`,
              height: `${40 + (i % 5) * 20}px`,
              animationDuration: `${1.2 + (i % 4) * 0.4}s`,
              animationDelay: `${(i * 0.15) % 2}s`
            }}
          />
        ))}
      </div>

      {/* Atmospheric Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-cyan-500/15 via-indigo-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
        {/* Ministry Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 shadow-glow-cyan mb-6 text-xs text-cyan-300 font-mono">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Smart India Hackathon • PS 26080</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-300">MoES / NCMRWF</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
          Regime-Aware <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">AI Post-Processing</span> of Monsoon Rainfall
        </h1>

        {/* Value Proposition */}
        <p className="max-w-3xl text-base sm:text-lg text-slate-300 mb-10 leading-relaxed font-normal">
          Numerical Weather Prediction (GFS 0.25°) models suffer from systematic orographic wet bias and displacement during active and depression spells. Our system integrates <strong className="text-cyan-300 font-semibold">synoptic circulation regimes</strong> into gradient-boosted ML to deliver high-resolution, calibrated precipitation intelligence verified against <strong className="text-white font-semibold">IMD 0.25° gridded observations</strong>.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-sm shadow-glow-cyan transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            Open Operations Dashboard
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('methodology')}
            className="px-6 py-3.5 rounded-xl glass-panel hover:bg-slate-800/80 text-slate-200 font-semibold text-sm border border-slate-700/80 transition-all flex items-center gap-2"
          >
            <GitFork className="w-4 h-4 text-cyan-400" />
            How It Works (Methodology)
          </button>

          <button
            onClick={() => onNavigate('model-comparison')}
            className="px-6 py-3.5 rounded-xl glass-panel hover:bg-slate-800/80 text-slate-200 font-semibold text-sm border border-slate-700/80 transition-all flex items-center gap-2"
          >
            <TrendingUp className="w-4 h-4 text-indigo-400" />
            B1–B4 Benchmark
          </button>
        </div>

        {/* 3 Core Innovation Headline Cards */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Card 1 */}
          <div
            onClick={() => onNavigate('model-comparison')}
            className="glass-panel p-6 rounded-2xl border border-slate-700/70 hover:border-cyan-500/50 transition-all cursor-pointer group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-2xl font-mono font-bold text-white">-28.4%</span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                SAMPLE RESULT
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-100 mb-1">Bias-Corrected Skill</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Quantile mapping & XGBoost eliminate raw GFS wet bias over Western Ghats, slashing All-India forecast RMSE from 19.8 mm to 14.2 mm.
            </p>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => onNavigate('regimes')}
            className="glass-panel p-6 rounded-2xl border border-slate-700/70 hover:border-indigo-500/50 transition-all cursor-pointer group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-4 group-hover:scale-110 transition-transform">
              <Activity className="w-5 h-5" />
            </div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-2xl font-mono font-bold text-white">4 Regimes</span>
              <span className="text-[10px] font-mono text-indigo-300 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                SYNOPTIC AWARE
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-100 mb-1">Circulation Regimes</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Active, Break, and Monsoon Depression states dynamically condition the model using normalized anomaly indexing over the Core Monsoon Zone.
            </p>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => onNavigate('heavy-rain-prob')}
            className="glass-panel p-6 rounded-2xl border border-slate-700/70 hover:border-amber-500/50 transition-all cursor-pointer group shadow-xl"
          >
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-110 transition-transform">
              <CloudRain className="w-5 h-5" />
            </div>
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-2xl font-mono font-bold text-white">P &gt; 64.5 mm</span>
              <span className="text-[10px] font-mono text-amber-400 bg-amber-950 px-2 py-0.5 rounded border border-amber-800">
                IMD HEAVY THRESHOLD
              </span>
            </div>
            <h3 className="text-base font-bold text-slate-100 mb-1">Calibrated Probabilities</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Reliable exceedance probabilities for disaster management authorities, verified with Brier Skill Scores and Reliability diagrams.
            </p>
          </div>
        </div>

        {/* Quick Reference Mini-Stats Bar */}
        <div className="w-full mt-12 pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <span className="block text-xl font-bold font-mono text-cyan-400">0.25° × 0.25°</span>
            <span className="text-[11px] text-slate-400">IMD Gridded Spatial Resolution</span>
          </div>
          <div>
            <span className="block text-xl font-bold font-mono text-indigo-400">122 Days</span>
            <span className="text-[11px] text-slate-400">Monsoon Season (JJAS)</span>
          </div>
          <div>
            <span className="block text-xl font-bold font-mono text-amber-400">+68.4%</span>
            <span className="text-[11px] text-slate-400">CSI Score Gain at 50mm Threshold</span>
          </div>
          <div>
            <span className="block text-xl font-bold font-mono text-emerald-400">0.90 AUC</span>
            <span className="text-[11px] text-slate-400">Extreme Rain ROC Discrimination</span>
          </div>
        </div>
      </div>
    </div>
  );
};
