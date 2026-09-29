import React from 'react';
import { AlertCircle, ExternalLink, ShieldCheck } from 'lucide-react';

interface BannerProps {
  onOpenLimitations?: () => void;
}

export const Banner: React.FC<BannerProps> = ({ onOpenLimitations }) => {
  return (
    <div className="bg-gradient-to-r from-amber-950/80 via-slate-900/90 to-cyan-950/80 border-b border-amber-500/30 text-xs py-2 px-4 backdrop-blur-md">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
          </span>
          <span className="font-semibold text-amber-300 flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5" />
            Demo Build: Illustrative Sample Data
          </span>
          <span className="hidden sm:inline text-slate-300">
            — Formulated on real GFS 0.25° & IMD NetCDF data schemas; not an operational NWP deployment.
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px]">
          <span className="hidden md:inline px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300 border border-slate-700 font-mono">
            USE_MOCK_DATA = true
          </span>
          {onOpenLimitations && (
            <button
              onClick={onOpenLimitations}
              className="text-amber-300 hover:text-amber-200 underline flex items-center gap-1 transition"
            >
              Scientific Claims & Boundaries <ExternalLink className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
