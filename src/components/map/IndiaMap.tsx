import React, { useState, useMemo } from 'react';
import { WeatherForecastRecord } from '../../types/weather';
import { projectCoordinates, getRainfallColor, getProbabilityColor } from '../../lib/geoUtils';
import { ZoomIn, ZoomOut, RotateCcw, Crosshair, Layers, Eye, Wind } from 'lucide-react';
import { MapLegend } from './MapLegend';

interface IndiaMapProps {
  forecasts: WeatherForecastRecord[];
  activeModel: 'b1_raw' | 'b2_qm' | 'b3_xgb' | 'b4_regime_xgb' | 'observed_rain' | 'probability';
  selectedDistrictId: string | null;
  onSelectDistrict: (districtId: string) => void;
  viewMode?: 'district' | 'grid';
  highlightThreshold?: number; // e.g. 64.5 mm
  showCoreZone?: boolean;
  showTroughLine?: boolean;
  height?: string;
  className?: string;
}

export const IndiaMap: React.FC<IndiaMapProps> = ({
  forecasts,
  activeModel,
  selectedDistrictId,
  onSelectDistrict,
  viewMode = 'district',
  highlightThreshold = 64.5,
  showCoreZone = true,
  showTroughLine = true,
  height = 'h-[580px]',
  className = ''
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hoveredRecord, setHoveredRecord] = useState<WeatherForecastRecord | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [showGridOverlay, setShowGridOverlay] = useState(viewMode === 'grid');
  const [showJetStream, setShowJetStream] = useState(true);

  // SVG dimensions
  const svgWidth = 780;
  const svgHeight = 880;

  // Calculate coordinates for the Core Monsoon Zone (21°N - 27°N, 73°E - 82°E)
  const coreZoneNW = projectCoordinates(27.0, 73.0, svgWidth, svgHeight);
  const coreZoneSE = projectCoordinates(21.0, 82.0, svgWidth, svgHeight);
  const coreZoneWidth = Math.abs(coreZoneSE.x - coreZoneNW.x);
  const coreZoneHeight = Math.abs(coreZoneSE.y - coreZoneNW.y);

  // Synoptic trough line coordinates across India
  const troughStart = projectCoordinates(28.5, 73.5, svgWidth, svgHeight); // NW Rajasthan
  const troughMid = projectCoordinates(24.0, 81.5, svgWidth, svgHeight);   // Central India
  const troughEnd = projectCoordinates(21.5, 89.0, svgWidth, svgHeight);   // Head Bay of Bengal

  // Value getter helper
  const getValue = (record: WeatherForecastRecord): number => {
    if (activeModel === 'probability') return record.prob_heavy_64_5;
    return record[activeModel];
  };

  // Generate synthetic 0.25° grid points within India
  const gridCells = useMemo(() => {
    if (!showGridOverlay && viewMode !== 'grid') return [];
    const cells = [];
    for (let lat = 9; lat <= 33; lat += 1.5) {
      for (let lon = 70; lon <= 92; lon += 1.5) {
        // Find nearest district for realistic rainfall shading
        let minDist = 999;
        let nearestRain = 10;
        forecasts.forEach(f => {
          const d = Math.hypot(f.lat - lat, f.lon - lon);
          if (d < minDist) {
            minDist = d;
            nearestRain = f[activeModel === 'probability' ? 'b4_regime_xgb' : activeModel];
          }
        });
        if (minDist < 4.0) {
          const { x, y } = projectCoordinates(lat, lon, svgWidth, svgHeight);
          cells.push({ x, y, rain: nearestRain, lat, lon });
        }
      }
    }
    return cells;
  }, [showGridOverlay, viewMode, forecasts, activeModel]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
    const rect = e.currentTarget.getBoundingClientRect();
    setTooltipPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div className={`relative w-full ${height} overflow-hidden rounded-2xl glass-panel border border-slate-700/60 shadow-2xl flex flex-col ${className}`}>
      {/* Top Map Action Bar */}
      <div className="absolute top-4 left-4 z-20 flex flex-wrap items-center gap-2">
        <div className="flex items-center bg-slate-900/80 backdrop-blur-md border border-slate-700/80 rounded-xl p-1 shadow-md">
          <button
            onClick={() => setShowGridOverlay(!showGridOverlay)}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              showGridOverlay ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            0.25° NetCDF Grid
          </button>
          <button
            onClick={() => setShowJetStream(!showJetStream)}
            className={`px-3 py-1 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5 ${
              showJetStream ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            850 hPa LLJ Stream
          </button>
        </div>

        {showCoreZone && (
          <span className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-mono rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Core Monsoon Zone (21–27°N)
          </span>
        )}
      </div>

      {/* Floating Zoom Controls */}
      <div className="absolute bottom-4 right-4 z-20 flex flex-col gap-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/80 p-1.5 rounded-xl shadow-xl">
        <button
          onClick={() => setZoom(prev => Math.min(prev + 0.25, 2.5))}
          title="Zoom In"
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoom(prev => Math.max(prev - 0.25, 0.75))}
          title="Zoom Out"
          className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={resetView}
          title="Reset Center"
          className="p-2 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-800 transition"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-4 left-4 z-20 max-w-xs hidden md:block">
        <MapLegend />
      </div>

      {/* Interactive SVG Canvas */}
      <div
        className="w-full h-full cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-full transition-transform duration-75"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: 'center center'
          }}
        >
          <defs>
            {/* Ambient gradients */}
            <radialGradient id="oceanGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#1E293B" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#0B1220" stopOpacity="0" />
            </radialGradient>
            <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="heavyPulse">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Background Ocean / Basin Grid Coordinates */}
          <g className="opacity-15 stroke-slate-600" strokeWidth="0.5" strokeDasharray="3,3">
            {[10, 15, 20, 25, 30, 35].map(lat => {
              const { y } = projectCoordinates(lat, 70, svgWidth, svgHeight);
              return <line key={`lat_${lat}`} x1="40" y1={y} x2={svgWidth - 40} y2={y} />;
            })}
            {[70, 75, 80, 85, 90, 95].map(lon => {
              const { x } = projectCoordinates(15, lon, svgWidth, svgHeight);
              return <line key={`lon_${lon}`} x1={x} y1="40" x2={x} y2={svgHeight - 40} />;
            })}
          </g>

          {/* Lat/Lon Coordinate Markers */}
          <g className="font-mono text-[9px] fill-slate-500 select-none opacity-60">
            {[10, 15, 20, 25, 30, 35].map(lat => {
              const { y } = projectCoordinates(lat, 70, svgWidth, svgHeight);
              return <text key={`lat_lbl_${lat}`} x="10" y={y + 3}>{lat}°N</text>;
            })}
            {[70, 75, 80, 85, 90, 95].map(lon => {
              const { x } = projectCoordinates(15, lon, svgWidth, svgHeight);
              return <text key={`lon_lbl_${lon}`} x={x - 8} y={svgHeight - 12}>{lon}°E</text>;
            })}
          </g>

          {/* India Continental Boundary Guide Base */}
          <path
            d="M 270 90 L 320 60 L 350 70 L 370 120 L 440 140 L 520 155 L 630 180 L 730 200 L 755 240 L 720 280 L 650 300 L 600 360 L 530 450 L 500 560 L 460 670 L 410 770 L 370 850 L 350 830 L 300 700 L 260 590 L 210 500 L 150 440 L 110 430 L 140 340 L 180 250 L 210 160 Z"
            fill="rgba(15, 23, 42, 0.65)"
            stroke="#334155"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />

          {/* 850 hPa Low-Level Westerly Jet (Findlater Jet) Simulation */}
          {showJetStream && (
            <g className="pointer-events-none">
              <path
                d="M 80 570 C 180 550, 280 530, 380 490 C 460 460, 520 420, 600 390"
                fill="none"
                stroke="#6366F1"
                strokeWidth="2.5"
                strokeDasharray="8,5"
                opacity="0.65"
              />
              <path
                d="M 60 630 C 160 610, 260 580, 360 540 C 440 500, 510 450, 580 420"
                fill="none"
                stroke="#818CF8"
                strokeWidth="2"
                strokeDasharray="6,4"
                opacity="0.5"
              />
              <text x="90" y="555" fill="#818CF8" fontSize="10" fontFamily="monospace" fontWeight="bold" opacity="0.85">
                850 hPa Low-Level Jet (&gt;30 kt)
              </text>
            </g>
          )}

          {/* Core Monsoon Zone (21-27°N, 73-82°E) Box */}
          {showCoreZone && (
            <g>
              <rect
                x={coreZoneNW.x}
                y={coreZoneNW.y}
                width={coreZoneWidth}
                height={coreZoneHeight}
                fill="rgba(16, 185, 129, 0.04)"
                stroke="#10B981"
                strokeWidth="1.5"
                strokeDasharray="6,4"
                rx="8"
              />
              <text
                x={coreZoneNW.x + 8}
                y={coreZoneNW.y + 18}
                fill="#10B981"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="bold"
              >
                CORE MONSOON ZONE (PS 26080)
              </text>
            </g>
          )}

          {/* Monsoon Trough Dynamic Axis */}
          {showTroughLine && (
            <g>
              <path
                d={`M ${troughStart.x} ${troughStart.y} Q ${troughMid.x} ${troughMid.y + 20} ${troughEnd.x} ${troughEnd.y}`}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="2.5"
                strokeDasharray="8,6"
              />
              <text
                x={troughEnd.x - 140}
                y={troughEnd.y + 25}
                fill="#F59E0B"
                fontSize="11"
                fontFamily="monospace"
                fontWeight="semibold"
              >
                Monsoon Trough Axis
              </text>
            </g>
          )}

          {/* 0.25° NetCDF Gridded Cells (Toggleable) */}
          {showGridOverlay && (
            <g className="transition-opacity duration-300">
              {gridCells.map((cell, idx) => {
                const colorInfo = getRainfallColor(cell.rain);
                return (
                  <rect
                    key={`grid_${idx}`}
                    x={cell.x - 11}
                    y={cell.y - 11}
                    width="22"
                    height="22"
                    fill={colorInfo.hex}
                    fillOpacity="0.55"
                    stroke="rgba(0, 0, 0, 0.2)"
                    strokeWidth="0.5"
                    rx="2"
                  />
                );
              })}
            </g>
          )}

          {/* District Stations / Points */}
          <g>
            {forecasts.map((record) => {
              const { x, y } = projectCoordinates(record.lat, record.lon, svgWidth, svgHeight);
              const val = getValue(record);
              const isSelected = selectedDistrictId === record.districtId;
              const isHovered = hoveredRecord?.districtId === record.districtId;
              const isHeavy = record.b4_regime_xgb >= highlightThreshold;
              
              let fillHex = '#38BDF8';
              if (activeModel === 'probability') {
                fillHex = getProbabilityColor(record.prob_heavy_64_5);
              } else {
                fillHex = getRainfallColor(val).hex;
              }

              return (
                <g
                  key={record.id}
                  className="cursor-pointer"
                  onClick={() => onSelectDistrict(record.districtId)}
                  onMouseEnter={() => setHoveredRecord(record)}
                  onMouseLeave={() => setHoveredRecord(null)}
                >
                  {/* Invisible generous hit target to prevent any mouse flickering */}
                  <circle
                    cx={x}
                    cy={y}
                    r="18"
                    fill="transparent"
                  />

                  {/* Heavy Rainfall Alert Halo */}
                  {isHeavy && (
                    <circle
                      cx={x}
                      cy={y}
                      r={isSelected ? 26 : 20}
                      fill="none"
                      stroke={fillHex}
                      strokeWidth="2"
                      className="animate-ping opacity-60 pointer-events-none"
                    />
                  )}

                  {/* Outer Glow Selection Ring */}
                  {isSelected && (
                    <circle
                      cx={x}
                      cy={y}
                      r="18"
                      fill="none"
                      stroke="#22D3EE"
                      strokeWidth="2.5"
                      strokeDasharray="4,2"
                      className="pointer-events-none"
                    />
                  )}

                  {/* Main District Point */}
                  <circle
                    cx={x}
                    cy={y}
                    r={isSelected ? 11 : isHovered ? 10.5 : 8}
                    fill={fillHex}
                    stroke={isSelected || isHovered ? '#FFFFFF' : 'rgba(15, 23, 42, 0.9)'}
                    strokeWidth={isSelected || isHovered ? 2.5 : 1.5}
                    filter={isHeavy ? 'url(#heavyPulse)' : undefined}
                    className="pointer-events-none transition-all duration-150"
                  />

                  {/* District Label (compact) */}
                  <text
                    x={x}
                    y={y - 12}
                    textAnchor="middle"
                    fill={isSelected || isHovered ? '#22D3EE' : '#CBD5E1'}
                    fontSize={isSelected || isHovered ? '11' : '9.5'}
                    fontWeight={isSelected || isHovered ? 'bold' : '500'}
                    className="pointer-events-none drop-shadow-md select-none"
                  >
                    {record.districtName.split(' ')[0]}
                  </text>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Floating Hover Tooltip */}
      {hoveredRecord && (
        <div
          className="absolute z-30 pointer-events-none transition-all duration-75 transform -translate-x-1/2 -translate-y-full mb-3"
          style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y - 10}px` }}
        >
          <div className="glass-panel p-3 rounded-xl border border-cyan-500/40 shadow-2xl bg-slate-900/95 text-xs w-64">
            <div className="flex items-center justify-between pb-1.5 border-b border-slate-700">
              <div>
                <h4 className="font-bold text-white text-sm">{hoveredRecord.districtName}</h4>
                <p className="text-[11px] text-slate-400">{hoveredRecord.state} • {hoveredRecord.region}</p>
              </div>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                {hoveredRecord.regime}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-2 font-mono">
              <div className="p-1.5 rounded bg-slate-800/80 border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block font-sans">
                  {activeModel === 'observed_rain' ? 'Observed IMD' : 'Predicted Rain'}
                </span>
                <span className="text-sm font-bold text-cyan-300">
                  {activeModel === 'probability' 
                    ? `${(hoveredRecord.prob_heavy_64_5 * 100).toFixed(0)}%`
                    : `${hoveredRecord[activeModel]} mm`
                  }
                </span>
              </div>
              <div className="p-1.5 rounded bg-slate-800/80 border border-slate-700/50">
                <span className="text-[10px] text-slate-400 block font-sans">Observed (IMD)</span>
                <span className="text-sm font-bold text-emerald-400">
                  {hoveredRecord.observed_rain} mm
                </span>
              </div>
            </div>

            <div className="mt-2 pt-1.5 border-t border-slate-700/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-400">P(Rain &gt; 64.5mm):</span>
              <span className={`font-mono font-bold ${hoveredRecord.prob_heavy_64_5 > 0.5 ? 'text-amber-400' : 'text-slate-300'}`}>
                {(hoveredRecord.prob_heavy_64_5 * 100).toFixed(0)}%
              </span>
            </div>
            {hoveredRecord.isCoreZone && (
              <div className="mt-1 text-[10px] text-emerald-400 flex items-center gap-1 font-mono">
                <Crosshair className="w-3 h-3" /> Core Monsoon Anomaly: {hoveredRecord.anomaly_sigma > 0 ? '+' : ''}{hoveredRecord.anomaly_sigma}σ
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
