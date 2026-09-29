import React from 'react';
import { Database, BookOpen, ExternalLink, ShieldCheck } from 'lucide-react';
import { PROJECT_METADATA } from '../../config';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800 bg-[#070D17] text-slate-400 py-10 px-4 mt-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Col 1: Overview */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-bold text-white text-base tracking-tight">
              Monsoon<span className="text-cyan-400">AI</span> Post-Processing
            </span>
            <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-mono">
              SIH PS 26080
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed mb-4 max-w-lg">
            A scientifically grounded machine learning prototype demonstrating post-processing of NOAA GFS 0.25° numerical weather prediction rainfall forecasts over India, conditioned on synoptic monsoon circulation regimes and verified against IMD 0.25° daily gridded observations.
          </p>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-500">
            <span>Client: {PROJECT_METADATA.department}</span>
            <span>•</span>
            <span>Target: {PROJECT_METADATA.ministry}</span>
          </div>
        </div>

        {/* Col 2: Data Sources */}
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-cyan-400" />
            Verified Data Inputs
          </h4>
          <ul className="text-xs space-y-2 text-slate-400">
            <li className="flex items-start gap-1.5">
              <span className="text-cyan-400 font-bold">•</span>
              <div>
                <strong className="text-slate-200">NWP:</strong> NOAA GFS 0.25° pgrb2 APCP 24h accumulation
              </div>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-cyan-400 font-bold">•</span>
              <div>
                <strong className="text-slate-200">Observed:</strong> IMD 0.25° Daily Gridded Rainfall (NetCDF)
              </div>
            </li>
            <li className="flex items-start gap-1.5">
              <span className="text-cyan-400 font-bold">•</span>
              <div>
                <strong className="text-slate-200">Grid:</strong> 135 × 129 points (6.5°–38.5°N, 66.5°–100°E)
              </div>
            </li>
          </ul>
        </div>

        {/* Col 3: Literature Citations */}
        <div>
          <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5 text-indigo-400" />
            Key Scientific Citations
          </h4>
          <ul className="text-[11px] space-y-2 text-slate-400">
            <li>
              <span className="text-slate-300 font-medium">Pai et al. (2014)</span>: Development of a new high resolution daily gridded rainfall dataset over the Indian region. <em>MAUSAM</em>.
            </li>
            <li>
              <span className="text-slate-300 font-medium">Rajeevan et al. (2010)</span>: Active and break spells of the Indian summer monsoon. <em>J. Earth Syst. Sci.</em>
            </li>
            <li>
              <span className="text-slate-300 font-medium">Roberts & Lean (2008)</span>: Scale-selective verification using Fractions Skill Score (FSS).
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-500">
        <p>© 2026 Smart India Hackathon Team • Problem Statement 26080. Built for student research & evaluation.</p>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Compliant with MoES / NCMRWF Technical Evaluation Guidelines</span>
        </div>
      </div>
    </footer>
  );
};
