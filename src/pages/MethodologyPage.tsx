import React, { useState } from 'react';
import { GitFork, Database, Clock, Layers, Cpu, CheckSquare, ArrowRight, ShieldCheck, FileText, ChevronRight } from 'lucide-react';

export const MethodologyPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(3);

  const pipelineSteps = [
    {
      id: 1,
      name: '01–02: Ingestion',
      subtitle: 'GFS GRIB2 & IMD NetCDF',
      desc: 'NOAA GFS 0.25° pgrb2 downloaded from AWS Open Data (s3://noaa-gfs-bdp-pds/). Daily observed rainfall downloaded from IMD Pune gridded archive.',
      details: 'GFS 00 UTC cycle. 6-hourly non-overlapping precipitation accumulation (FH006 + FH012 + FH018 + FH024) to form 24h total.'
    },
    {
      id: 2,
      name: '03–06: Spatiotemporal Alignment',
      subtitle: 'Time offset & Bilinear Grid',
      desc: 'Resolution of the 3-hour UTC vs IST boundary mismatch and spatial bilinear interpolation onto the 135 × 129 IMD reference grid.',
      details: 'IMD daily rain represents 03:00 UTC to 03:00 UTC next day (08:30 IST). GFS 00–24 UTC matched with documented 3h offset.'
    },
    {
      id: 3,
      name: '07–08: Tabular Dataset & Regimes',
      subtitle: 'Atmospheric Predictors & Regimes',
      desc: 'Feature engineering combining physical NWP dynamics (TMP_2m, RH_2m, UGRD, VGRD, CAPE, APCP) with synoptic regime categorization.',
      details: 'Active, Break, and Depression classification computed over Core Monsoon Zone (21°–27°N, 73°–82°E) via normalized anomaly thresholds.'
    },
    {
      id: 4,
      name: '09–12: Progressive ML Baselines',
      subtitle: 'B1 → B2 → B3 → B4 Architecture',
      desc: 'Hierarchical modeling from raw NWP (B1), empirical quantile mapping (B2), generic XGBoost regressor (B3), to regime-conditioned XGBoost (B4).',
      details: 'XGBoost hist tree method, n_estimators=500, max_depth=6, learning_rate=0.05, trained strictly on 2020–2022 CPU partitions.'
    },
    {
      id: 5,
      name: '13–16: Evaluation & District Product',
      subtitle: 'Categorical & Spatial Verification',
      desc: 'Objective scoring via RMSE, CSI, POD, FAR, ETS, and FSS, aggregated to operational district-level summaries for disaster response.',
      details: 'Area-weighted polygon aggregation preserves grid-level extreme rainfall variance without over-smoothing peak convective cells.'
    }
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <GitFork className="w-5 h-5" />
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">Methodology & Computational Pipeline</h2>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl">
          Complete scientific data processing workflow as specified in the MoES / NCMRWF Technical Specification for Problem Statement 26080.
        </p>
      </div>

      {/* Interactive Horizontal Pipeline Diagram */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Cpu className="w-4 h-4 text-cyan-400" />
            End-to-End Pipeline Architecture (Click Step to Inspect)
          </h3>
          <span className="text-[10px] font-mono text-cyan-300 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
            16-STAGE WORKFLOW
          </span>
        </div>

        {/* Pipeline Step Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          {pipelineSteps.map((step) => {
            const isSelected = activeStep === step.id;
            return (
              <div
                key={step.id}
                onClick={() => setActiveStep(step.id)}
                className={`p-3.5 rounded-xl cursor-pointer border transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-500/15 border-cyan-400 shadow-glow-cyan scale-[1.02]'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div>
                  <span className="text-[10px] font-mono font-bold text-cyan-400 block mb-1">
                    STAGE {step.id}
                  </span>
                  <h4 className="text-xs font-bold text-white mb-1">{step.name}</h4>
                  <span className="text-[10px] text-slate-400 block">{step.subtitle}</span>
                </div>
                <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500">
                  <span>{isSelected ? 'Inspecting' : 'Click to inspect'}</span>
                  <ChevronRight className={`w-3.5 h-3.5 ${isSelected ? 'text-cyan-400' : 'text-slate-600'}`} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Step Detail Inspection Box */}
        <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-700/80">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <h4 className="text-sm font-bold text-white">
              Stage Detail: {pipelineSteps[activeStep - 1].name} ({pipelineSteps[activeStep - 1].subtitle})
            </h4>
          </div>
          <p className="text-xs text-slate-300 mb-3 leading-relaxed">
            {pipelineSteps[activeStep - 1].desc}
          </p>
          <div className="text-xs font-mono text-cyan-300/90 bg-slate-950 p-3 rounded-lg border border-slate-800">
            <strong>Implementation Specification:</strong> {pipelineSteps[activeStep - 1].details}
          </div>
        </div>
      </div>

      {/* Verified Data Sources Specification Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Source 1: NOAA GFS */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">
                NWP INPUT DATASET
              </span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> VERIFIED OPEN ACCESS
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">NOAA Global Forecast System (GFS 0.25°)</h3>
            <ul className="text-xs text-slate-300 space-y-2 mb-4 font-mono">
              <li>• <strong className="text-slate-100">Archive:</strong> AWS S3 (s3://noaa-gfs-bdp-pds/gfs.YYYYMMDD/00/atmos/)</li>
              <li>• <strong className="text-slate-100">Parameter:</strong> APCP (Total Precipitation, Surface, kg/m² = mm)</li>
              <li>• <strong className="text-slate-100">Resolution:</strong> 0.25° × 0.25° (~27 km at tropics)</li>
              <li>• <strong className="text-slate-100">Forecast Cycles:</strong> 00 UTC Initialization (Lead Time FH006–FH024)</li>
              <li>• <strong className="text-slate-100">Predictors:</strong> TMP_2m, RH_2m, UGRD_10m, VGRD_10m, CAPE, PRMSL</li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
            <strong>Reproducibility Note:</strong> GFS was selected over NCUM for this student project because NOAA GFS archives are publicly accessible via AWS S3 without institutional licensing barriers.
          </div>
        </div>

        {/* Source 2: IMD Gridded Rainfall */}
        <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-200 border border-slate-700">
                GROUND TRUTH OBSERVATION
              </span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> IMD PUNE STANDARD
              </span>
            </div>

            <h3 className="text-lg font-bold text-white mb-2">IMD 0.25° Daily Gridded Rainfall (NetCDF)</h3>
            <ul className="text-xs text-slate-300 space-y-2 mb-4 font-mono">
              <li>• <strong className="text-slate-100">Citation:</strong> Pai et al. (2014), MAUSAM 65, 1, 1–18</li>
              <li>• <strong className="text-slate-100">File Format:</strong> NetCDF (.nc), Variable: RAINFALL</li>
              <li>• <strong className="text-slate-100">Domain Grid:</strong> 135 × 129 points (6.5°N–38.5°N, 66.5°E–100.0°E)</li>
              <li>• <strong className="text-slate-100">Temporal Window:</strong> 03:00 UTC to 03:00 UTC next day (08:30 IST)</li>
              <li>• <strong className="text-slate-100">Missing Value:</strong> -999.0 (Masked out during training)</li>
            </ul>
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400">
            <strong>Operational Target:</strong> Interpolation is performed from GFS to the IMD grid to preserve the native spatial resolution and official verification standard of the meteorological agency.
          </div>
        </div>
      </div>

      {/* Train / Validation / Test Split Visual Timeline */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col gap-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Clock className="w-4 h-4 text-cyan-400" />
          Rigorous Temporal Split Architecture (Zero Data Leakage)
        </h3>
        <p className="text-xs text-slate-400">
          Strict chronological partition prevents future information leakage into historical model weights.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs mt-2">
          {/* Training */}
          <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-600/40">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-blue-300 text-sm">Training Partition</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-blue-900 text-blue-200">2020 – 2022</span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed mb-2">
              3 Southwest Monsoon Seasons (JJAS). Fits empirical quantile CDFs and trains XGBoost gradient boosted trees (~6 million samples).
            </p>
            <span className="text-[10px] text-blue-400">Volume: 366 days × 135 × 129 grid points</span>
          </div>

          {/* Validation */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-600/40">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-indigo-300 text-sm">Validation Partition</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-900 text-indigo-200">2023 Monsoon</span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed mb-2">
              Hyperparameter tuning (max_depth, subsample, learning_rate) and probability calibration threshold selection.
            </p>
            <span className="text-[10px] text-indigo-400">Volume: 122 days × 135 × 129 grid points</span>
          </div>

          {/* Test */}
          <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-400/40">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-cyan-300 text-sm">Test Partition</span>
              <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-900 text-cyan-200">2024 Monsoon</span>
            </div>
            <p className="text-[11px] text-slate-300 font-sans leading-relaxed mb-2">
              Completely independent future evaluation. Never exposed during parameter estimation or tree induction.
            </p>
            <span className="text-[10px] text-cyan-300">Final Verification Benchmark</span>
          </div>
        </div>
      </div>
    </div>
  );
};
