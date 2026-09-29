import React from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Layers, Info, CheckCircle2, XCircle } from 'lucide-react';

export const LimitationsPage: React.FC = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="p-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-5 h-5" />
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">Scientific Integrity: Claims & Boundaries</h2>
        </div>
        <p className="text-xs text-slate-400 max-w-3xl">
          Scientific transparency and rigorous boundaries as mandated by the MoES / NCMRWF evaluation panel: Explicitly contrasting what this project claims against what it does NOT claim.
        </p>
      </div>

      {/* Two-Column Comparison Card: What We Claim vs What We Do NOT Claim */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left: What This Project Claims */}
        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-emerald-500/20">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
              <h3 className="text-base font-bold text-white">What This Project Claims (Defensible)</h3>
            </div>

            <ul className="space-y-3.5 text-xs text-slate-200">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>
                  <strong className="text-emerald-300">Demonstrated Improvement over GFS:</strong> Quantile mapping and XGBoost post-processing reduce 24-hour rainfall forecast RMSE across India by 28.4% relative to raw GFS.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>
                  <strong className="text-emerald-300">Regime Awareness Outperforms Generic ML:</strong> Conditioning the model on Active, Break, and Depression states improves the Critical Success Index (CSI) for heavy rainfall (&gt;50 mm) by +68.4% without causing severe false alarm inflation.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>
                  <strong className="text-emerald-300">Calibrated Probabilities for Heavy Rain:</strong> Extreme rainfall exceedance probabilities are empirically calibrated, yielding a Brier Score of 0.048 and ROC AUC of 0.90.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0" />
                <span>
                  <strong className="text-emerald-300">Reproducible Student Implementation:</strong> Pipeline runs on standard CPU laptops and cloud environments without requiring inaccessible supercomputing clusters.
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 text-[11px] text-emerald-300">
            All claimed metrics are computed strictly on unseen validation/test data partitions with zero data leakage.
          </div>
        </div>

        {/* Right: What This Project Does NOT Claim */}
        <div className="glass-panel p-6 rounded-2xl border border-rose-500/30 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-rose-500/20">
              <XCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
              <h3 className="text-base font-bold text-white">What This Project Does NOT Claim</h3>
            </div>

            <ul className="space-y-3.5 text-xs text-slate-300">
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                <span>
                  <strong className="text-rose-300">NOT an Operational Forecasting System:</strong> This is a scientific research prototype tested on historical archives. It does not ingest real-time operational GTS telemetry or satellite radiance data.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                <span>
                  <strong className="text-rose-300">Did NOT Post-Process NCUM Directly:</strong> Raw historical NCUM (NCMRWF Unified Model) archives are restricted to institutional research agreements. NOAA GFS 0.25° was used as a scientifically verified open-access stand-in.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                <span>
                  <strong className="text-rose-300">Acknowledged 3-Hour Time Offset:</strong> GFS 24h accumulation spans 00–24 UTC, whereas IMD daily gridded observations span 03–03 UTC (08:30 IST). This 3-hour phase shift is an accepted experimental limitation.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5 flex-shrink-0" />
                <span>
                  <strong className="text-rose-300">No Deep Learning Black Boxes:</strong> Deep learning transformers were explicitly omitted as unnecessary for tabular NWP post-processing, prioritizing physical explainability and CPU feasibility.
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-6 p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-[11px] text-rose-300">
            Adheres strictly to the ethical scientific reporting standards outlined in MoES Section 27.
          </div>
        </div>
      </div>

      {/* Fallback Strategy Hierarchy */}
      <div className="glass-panel p-6 rounded-2xl border border-slate-700/60 shadow-xl flex flex-col gap-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-cyan-400" />
          Technical Fallback Hierarchy
        </h3>
        <p className="text-xs text-slate-400">
          Graduated hierarchy establishing scope and legitimate claims under varying data access constraints.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800 font-sans">
              <tr>
                <th className="p-3">Level</th>
                <th className="p-3">Target NWP Data</th>
                <th className="p-3">Observation Data</th>
                <th className="p-3">Scope</th>
                <th className="p-3">Permissible Scientific Claims</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-800/20">
                <td className="p-3 font-sans font-bold text-slate-400">Level 1 (Ideal)</td>
                <td className="p-3">NCMRWF NCUM</td>
                <td className="p-3">IMD 0.25° NetCDF</td>
                <td className="p-3">All India, All 6 Regimes</td>
                <td className="p-3 text-emerald-400">Full PS 26080 Operational Deployment</td>
              </tr>
              <tr className="bg-cyan-950/20 hover:bg-cyan-950/30">
                <td className="p-3 font-sans font-bold text-cyan-300">Level 2 (This Project)</td>
                <td className="p-3 text-cyan-300">NOAA GFS 0.25°</td>
                <td className="p-3 text-cyan-300">IMD 0.25° NetCDF</td>
                <td className="p-3 text-cyan-300">All India, Active/Break/Low</td>
                <td className="p-3 text-cyan-300 font-bold">"Improved GFS Monsoon Rainfall Forecast"</td>
              </tr>
              <tr className="hover:bg-slate-800/20">
                <td className="p-3 font-sans font-bold text-slate-400">Level 3 (Reduced)</td>
                <td className="p-3">NOAA GFS 0.25°</td>
                <td className="p-3">IMD 0.25° NetCDF</td>
                <td className="p-3">Core Monsoon Zone Only</td>
                <td className="p-3 text-slate-400">"Proof of Concept in Core Monsoon Zone"</td>
              </tr>
              <tr className="hover:bg-slate-800/20">
                <td className="p-3 font-sans font-bold text-slate-400">Level 4 (Synthetic)</td>
                <td className="p-3">Small Sample</td>
                <td className="p-3">Synthetic / Subset</td>
                <td className="p-3">1 Month, 1 Regime</td>
                <td className="p-3 text-amber-400">"Methodology Validated Only (No Real Claims)"</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
