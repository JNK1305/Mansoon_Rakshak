import React from 'react';
import { AlertTriangle, Radio, Compass, ArrowUpRight } from 'lucide-react';

interface OperationalTickerProps {
  currentRegime: string;
  anomalySigma: number;
}

export const OperationalTicker: React.FC<OperationalTickerProps> = ({ currentRegime, anomalySigma }) => {
  return (
    <div className="w-full bg-[#070D18] border-b border-slate-800 text-slate-300 text-xs py-1.5 px-4 overflow-hidden relative">
      <div className="max-w-7xl mx-auto flex items-center gap-3">
        {/* Live indicator badge */}
        <div className="flex items-center gap-1.5 bg-red-950/80 border border-red-500/50 text-red-300 px-2 py-0.5 rounded text-[10px] font-mono font-bold flex-shrink-0">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
          <span>IMD BULLETIN</span>
        </div>

        {/* Scrolling or static briefing ticker */}
        <div className="flex-1 overflow-x-auto no-scrollbar whitespace-nowrap font-mono text-[11px] text-slate-300 flex items-center gap-6">
          <span className="flex items-center gap-1.5">
            <Radio className="w-3 h-3 text-cyan-400" />
            <strong className="text-white">SYNOPTIC STATUS:</strong> {currentRegime} Monsoon Regime (Core Zone Anomaly: {anomalySigma > 0 ? `+${anomalySigma}` : anomalySigma}σ)
          </span>
          <span className="text-slate-600">|</span>
          <span>
            <strong className="text-cyan-300">TROUGH AXIS:</strong> South of normal alignment; active low-level westerly jet (850 hPa &gt; 32 kt) across Arabian Sea to Central India
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-amber-300">
            <strong className="text-amber-200">HEAVY RAIN WARNING:</strong> P(&gt;64.5mm) elevated in Bilaspur (88%), Raipur (82%), Jabalpur (79%), Mumbai (74%)
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400">
            <strong className="text-emerald-300">AI CORRECTION:</strong> GFS raw orographic wet bias attenuated by 31.8% over Western Ghats & Vidarbha
          </span>
        </div>

        <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 border-l border-slate-800 pl-3 flex-shrink-0">
          <span>CYCLE: 00 UTC +24H</span>
        </div>
      </div>
    </div>
  );
};
