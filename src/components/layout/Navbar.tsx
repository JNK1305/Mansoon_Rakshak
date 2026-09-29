import React, { useState } from 'react';
import { CloudRain, Compass, Activity, ShieldAlert, BarChart3, GitFork, Sun, Moon, Menu, X, CheckCircle2 } from 'lucide-react';
import { RegimeType } from '../../types/weather';
import { REGIME_DEFINITIONS } from '../../config';

export type PageId =
  | 'landing'
  | 'dashboard'
  | 'model-comparison'
  | 'regimes'
  | 'heavy-rain-prob'
  | 'verification'
  | 'methodology'
  | 'limitations';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  currentRegime: RegimeType;
  anomalySigma: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenPitch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  currentRegime,
  anomalySigma,
  isDarkMode,
  onToggleTheme,
  onOpenPitch
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Operations Dashboard', icon: <Compass className="w-4 h-4" /> },
    { id: 'model-comparison', label: 'Model Benchmark (B1–B4)', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'regimes', label: 'Weather Regimes', icon: <Activity className="w-4 h-4" /> },
    { id: 'heavy-rain-prob', label: 'Heavy Rain Probability', icon: <CloudRain className="w-4 h-4" /> },
    { id: 'verification', label: 'Extreme Verification', icon: <CheckCircle2 className="w-4 h-4" /> },
    { id: 'methodology', label: 'Pipeline & NetCDF', icon: <GitFork className="w-4 h-4" /> },
    { id: 'limitations', label: 'Claims & Boundaries', icon: <ShieldAlert className="w-4 h-4" /> }
  ];

  const regimeInfo = REGIME_DEFINITIONS[currentRegime];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-700/60 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo and Department Brand */}
        <div
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 cursor-pointer group flex-shrink-0"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-indigo-600 to-cyan-400 p-0.5 shadow-glow-cyan transition-transform group-hover:scale-105">
            <div className="w-full h-full bg-[#0B1220] rounded-[10px] flex items-center justify-center">
              <CloudRain className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-tight text-white text-base">
                Monsoon<span className="text-cyan-400">AI</span>
              </span>
              <span className="px-1.5 py-0.5 text-[10px] font-mono rounded bg-cyan-950 text-cyan-300 border border-cyan-800">
                PS 26080
              </span>
            </div>
            <p className="text-[10px] text-slate-400 tracking-wide hidden sm:block">
              MoES / NCMRWF Regime-Aware Post-Processing
            </p>
          </div>
        </div>

        {/* Center Desktop Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/30 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Status Indicator & Actions */}
        <div className="flex items-center gap-2.5">
          {/* SIH Judge 30-Second Pitch Button */}
          <button
            onClick={onOpenPitch}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-glow-cyan transition-all transform hover:scale-105 flex items-center gap-1.5"
            title="Open 30-Second Executive Summary for SIH Evaluators"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-200 animate-ping"></span>
            <span>⚡ 30s Pitch</span>
          </button>

          {/* Active Synoptic Regime Badge */}
          <div
            onClick={() => onNavigate('regimes')}
            title={`Current regime: ${regimeInfo.label}. Click to inspect regime dynamics.`}
            className="cursor-pointer hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-xl border text-xs font-mono transition-transform hover:scale-105"
            style={{
              backgroundColor: regimeInfo.bgColor,
              borderColor: regimeInfo.borderColor,
              color: regimeInfo.color
            }}
          >
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: regimeInfo.color }} />
            <span className="font-bold">{currentRegime}</span>
            <span className="text-[11px] opacity-80">
              {anomalySigma > 0 ? `+${anomalySigma}σ` : `${anomalySigma}σ`}
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-700/60 transition"
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-cyan-400" />}
          </button>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 border border-slate-700/60"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0B1220]/95 backdrop-blur-xl px-4 py-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2.5 ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
