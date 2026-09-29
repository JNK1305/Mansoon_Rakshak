import React from 'react';
import { IMD_RAINFALL_THRESHOLDS } from '../../config';

interface MapLegendProps {
  className?: string;
  horizontal?: boolean;
}

export const MapLegend: React.FC<MapLegendProps> = ({ className = '', horizontal = false }) => {
  return (
    <div className={`glass-panel p-3 rounded-xl border border-slate-700/60 shadow-lg text-xs ${className}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold tracking-wide text-slate-300">IMD 24h Rainfall Scale (mm)</span>
        <span className="text-[10px] text-cyan-400 font-mono">0.25° Gridded</span>
      </div>
      <div className={horizontal ? "flex flex-wrap gap-2 items-center" : "flex flex-col gap-1.5"}>
        {IMD_RAINFALL_THRESHOLDS.map((cat) => (
          <div key={cat.id} className="flex items-center gap-2">
            <span
              className="w-3.5 h-3.5 rounded-sm shadow-sm flex-shrink-0 border border-black/20"
              style={{ backgroundColor: cat.hex }}
            />
            <div className="flex items-baseline justify-between w-full gap-2">
              <span className="text-slate-300 font-medium text-[11px]">{cat.label}</span>
              <span className="text-slate-400 font-mono text-[10px]">
                {cat.max === 999 ? `≥ ${cat.min}` : `${cat.min}–${cat.max}`}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
