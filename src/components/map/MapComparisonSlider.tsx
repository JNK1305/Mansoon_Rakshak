import React, { useState } from 'react';
import { WeatherForecastRecord } from '../../types/weather';
import { projectCoordinates, getRainfallColor } from '../../lib/geoUtils';
import { Sliders, Columns, Maximize2 } from 'lucide-react';
import { MapLegend } from './MapLegend';

interface MapComparisonSliderProps {
  forecasts: WeatherForecastRecord[];
  dateStr: string;
}

export const MapComparisonSlider: React.FC<MapComparisonSliderProps> = ({ forecasts, dateStr }) => {
  const [mode, setMode] = useState<'side-by-side' | 'swipe'>('side-by-side');
  const [sliderPos, setSliderPos] = useState(50); // percentage 0-100
  const [hoveredDistrict, setHoveredDistrict] = useState<WeatherForecastRecord | null>(null);

  const svgWidth = 550;
  const svgHeight = 650;

  const renderSubMap = (
    title: string,
    modelKey: 'b1_raw' | 'b4_regime_xgb' | 'observed_rain',
    badgeText: string,
    badgeColor: string
  ) => {
    return (
      <div className="flex-1 glass-panel rounded-2xl border border-slate-700/60 p-4 flex flex-col relative overflow-hidden">
        <div className="flex items-center justify-between mb-3 z-10">
          <div>
            <h4 className="font-bold text-slate-100 text-sm">{title}</h4>
            <span className="text-[11px] text-slate-400 font-mono">Date: {dateStr}</span>
          </div>
          <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border ${badgeColor}`}>
            {badgeText}
          </span>
        </div>

        <div className="relative w-full h-[400px] flex items-center justify-center">
          <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
            {/* Base Outline */}
            <path
              d="M 190 70 L 230 45 L 255 55 L 270 95 L 320 110 L 375 120 L 450 140 L 515 155 L 530 185 L 505 215 L 455 235 L 420 280 L 370 350 L 350 435 L 320 520 L 285 600 L 255 660 L 245 645 L 210 545 L 180 460 L 145 390 L 105 345 L 75 335 L 98 265 L 125 195 L 150 125 Z"
              fill="rgba(15, 23, 42, 0.7)"
              stroke="#334155"
              strokeWidth="1.2"
            />

            {/* Core Monsoon Zone Reference */}
            <rect
              x="180"
              y="270"
              width="150"
              height="110"
              fill="rgba(16, 185, 129, 0.04)"
              stroke="#10B981"
              strokeWidth="1"
              strokeDasharray="4,3"
              rx="4"
            />

            {/* District Points */}
            {forecasts.map((record) => {
              const { x, y } = projectCoordinates(record.lat, record.lon, svgWidth, svgHeight);
              const val = record[modelKey];
              const colorInfo = getRainfallColor(val);
              const isHovered = hoveredDistrict?.districtId === record.districtId;

              return (
                <g
                  key={`${modelKey}_${record.id}`}
                  onMouseEnter={() => setHoveredDistrict(record)}
                  onMouseLeave={() => setHoveredDistrict(null)}
                  className="cursor-pointer"
                >
                  {isHovered && (
                    <circle cx={x} cy={y} r="16" fill="none" stroke="#22D3EE" strokeWidth="2" strokeDasharray="3,2" />
                  )}
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 8 : 6}
                    fill={colorInfo.hex}
                    stroke="rgba(15, 23, 42, 0.8)"
                    strokeWidth="1.5"
                  />
                  {isHovered && (
                    <text
                      x={x}
                      y={y - 10}
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {val} mm
                    </text>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Bottom Inspection Summary */}
        {hoveredDistrict && (
          <div className="mt-2 p-2 rounded-xl bg-slate-900/90 border border-slate-700/60 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-sans">{hoveredDistrict.districtName}</span>
            <span className="text-cyan-400 font-bold">{hoveredDistrict[modelKey]} mm</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Control bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode('side-by-side')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition ${
              mode === 'side-by-side'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            3-Way Synchronized Grid
          </button>
          <button
            onClick={() => setMode('swipe')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition ${
              mode === 'swipe'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            Interactive Swipe Compare (B1 vs B4)
          </button>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-slate-400">
            {hoveredDistrict ? `Inspecting: ${hoveredDistrict.districtName} (${hoveredDistrict.state})` : 'Hover on any district to compare all 3 views simultaneously'}
          </span>
        </div>
      </div>

      {mode === 'side-by-side' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {renderSubMap(
            'Raw GFS 0.25° (B1 Baseline)',
            'b1_raw',
            'NWP Deterministic',
            'bg-slate-800 text-slate-300 border-slate-700'
          )}
          {renderSubMap(
            'IMD 0.25° Daily NetCDF',
            'observed_rain',
            'Ground Truth (Observed)',
            'bg-emerald-950/60 text-emerald-400 border-emerald-700'
          )}
          {renderSubMap(
            'Regime-Aware XGBoost (B4)',
            'b4_regime_xgb',
            'MoES AI Post-Processed',
            'bg-cyan-950/60 text-cyan-300 border-cyan-700 shadow-glow-cyan'
          )}
        </div>
      ) : (
        /* Interactive Curtain Swipe Comparator */
        <div className="glass-panel p-4 rounded-2xl border border-slate-700/60 relative overflow-hidden flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <span className="text-sm font-bold text-slate-300">Left: Raw GFS (B1)</span>
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPos}
              onChange={(e) => setSliderPos(Number(e.target.value))}
              className="w-1/2 accent-cyan-400 cursor-ew-resize"
            />
            <span className="text-sm font-bold text-cyan-400">Right: Regime-Aware XGBoost (B4)</span>
          </div>

          <div className="relative w-full max-w-2xl h-[480px] bg-slate-950/80 rounded-xl overflow-hidden border border-slate-800">
            {/* Left Layer: Raw GFS */}
            <div className="absolute inset-0">
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
                <path
                  d="M 190 70 L 230 45 L 255 55 L 270 95 L 320 110 L 375 120 L 450 140 L 515 155 L 530 185 L 505 215 L 455 235 L 420 280 L 370 350 L 350 435 L 320 520 L 285 600 L 255 660 L 245 645 L 210 545 L 180 460 L 145 390 L 105 345 L 75 335 L 98 265 L 125 195 L 150 125 Z"
                  fill="rgba(15, 23, 42, 0.7)"
                  stroke="#334155"
                  strokeWidth="1.2"
                />
                {forecasts.map((record) => {
                  const { x, y } = projectCoordinates(record.lat, record.lon, svgWidth, svgHeight);
                  const color = getRainfallColor(record.b1_raw).hex;
                  return (
                    <circle key={`b1_${record.id}`} cx={x} cy={y} r="7" fill={color} stroke="#000" strokeWidth="1" />
                  );
                })}
              </svg>
            </div>

            {/* Right Layer: Regime-Aware B4 clipped by slider */}
            <div
              className="absolute inset-0 overflow-hidden"
              style={{ clipPath: `polygon(${sliderPos}% 0, 100% 0, 100% 100%, ${sliderPos}% 100%)` }}
            >
              <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full">
                <path
                  d="M 190 70 L 230 45 L 255 55 L 270 95 L 320 110 L 375 120 L 450 140 L 515 155 L 530 185 L 505 215 L 455 235 L 420 280 L 370 350 L 350 435 L 320 520 L 285 600 L 255 660 L 245 645 L 210 545 L 180 460 L 145 390 L 105 345 L 75 335 L 98 265 L 125 195 L 150 125 Z"
                  fill="rgba(15, 23, 42, 0.7)"
                  stroke="#38BDF8"
                  strokeWidth="1.2"
                />
                {forecasts.map((record) => {
                  const { x, y } = projectCoordinates(record.lat, record.lon, svgWidth, svgHeight);
                  const color = getRainfallColor(record.b4_regime_xgb).hex;
                  return (
                    <circle key={`b4_${record.id}`} cx={x} cy={y} r="7" fill={color} stroke="#000" strokeWidth="1" />
                  );
                })}
              </svg>
            </div>

            {/* Vertical Divider Line */}
            <div
              className="absolute top-0 bottom-0 w-1 bg-cyan-400 shadow-glow-cyan pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -left-3.5 w-8 h-8 rounded-full bg-cyan-400 text-slate-950 flex items-center justify-center font-bold text-xs shadow-lg">
                ⇄
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Embedded Map Legend */}
      <div className="mt-2">
        <MapLegend horizontal />
      </div>
    </div>
  );
};
