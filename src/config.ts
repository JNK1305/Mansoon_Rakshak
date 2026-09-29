// Configuration and Operational Constants for Regime-Aware Rainfall AI (SIH PS 26080)

export const USE_MOCK_DATA = true;

export const PROJECT_METADATA = {
  id: "PS 26080",
  title: "Regime-Aware AI Post-Processing of Monsoon Rainfall Forecasts",
  ministry: "Ministry of Earth Sciences (MoES)",
  department: "National Centre for Medium Range Weather Forecasting (NCMRWF)",
  version: "1.0.0-SIH-DEMO",
  baselineForecast: "NOAA GFS 0.25° (24-Hour APCP)",
  verificationTarget: "IMD 0.25° Daily Gridded Rainfall (NetCDF)",
  domain: "India Mainland (6.5°N - 38.5°N, 66.5°E - 100.0°E)",
  coreMonsoonZone: "21°N - 27°N, 73°E - 82°E",
};

// IMD Official Rainfall Intensity Classifications (mm / 24h)
export const IMD_RAINFALL_THRESHOLDS = [
  { id: 'trace', label: 'No / Trace Rain', min: 0, max: 2.4, color: 'rgba(255, 255, 255, 0.05)', hex: '#334155' },
  { id: 'light', label: 'Light Rain', min: 2.5, max: 15.5, color: '#38BDF8', hex: '#38BDF8' },
  { id: 'moderate', label: 'Moderate Rain', min: 15.6, max: 64.4, color: '#22C55E', hex: '#22C55E' },
  { id: 'heavy', label: 'Heavy Rain', min: 64.5, max: 115.5, color: '#EAB308', hex: '#EAB308' },
  { id: 'very_heavy', label: 'Very Heavy Rain', min: 115.6, max: 204.4, color: '#F97316', hex: '#F97316' },
  { id: 'extremely_heavy', label: 'Extremely Heavy Rain', min: 204.5, max: 999.0, color: '#9333EA', hex: '#9333EA' },
];

export const MODELS = [
  {
    id: 'b1_raw',
    code: 'B1',
    name: 'Raw GFS 0.25°',
    shortDesc: 'Deterministic raw NWP baseline',
    longDesc: 'NOAA GFS 00 UTC cycle, summing 6h accumulations (FH006 + FH012 + FH018 + FH024). Known wet bias over Western Ghats.',
    badgeClass: 'bg-slate-700 text-slate-200 border-slate-600',
    color: '#94A3B8'
  },
  {
    id: 'b2_qm',
    code: 'B2',
    name: 'Quantile Mapping',
    shortDesc: 'Statistical bias correction',
    longDesc: 'Empirical CDF matching F_obs⁻¹(F_nwp(x)) fitted on 2020-2022 historical training distribution. Corrects mean & variance.',
    badgeClass: 'bg-blue-900/60 text-blue-300 border-blue-600',
    color: '#60A5FA'
  },
  {
    id: 'b3_xgb',
    code: 'B3',
    name: 'Generic XGBoost',
    shortDesc: 'Standard tabular gradient boosted trees',
    longDesc: 'Trained on NWP atmospheric variables (TMP_2m, RH_2m, UGRD, VGRD, CAPE, APCP) without synoptic regime awareness.',
    badgeClass: 'bg-indigo-900/60 text-indigo-300 border-indigo-600',
    color: '#818CF8'
  },
  {
    id: 'b4_regime_xgb',
    code: 'B4',
    name: 'Regime-Aware XGBoost',
    shortDesc: 'MoES/NCMRWF Core Innovation',
    longDesc: 'Conditioned on synoptic monsoon circulation regimes (Active, Break, Monsoon Low/Depression) with core-zone anomaly indexing.',
    badgeClass: 'bg-cyan-900/60 text-cyan-300 border-cyan-400 font-semibold shadow-glow-cyan',
    color: '#22D3EE'
  }
];

export const REGIME_DEFINITIONS = {
  Active: {
    label: 'Active Monsoon',
    color: '#10B981',
    bgColor: 'rgba(16, 185, 129, 0.15)',
    borderColor: '#059669',
    criteria: 'Core monsoon zone (21-27°N, 73-82°E) normalized rainfall anomaly > +1.0 for ≥3 consecutive days.',
    synopticDescription: 'Monsoon trough south of its normal position; strong low-level westerly jet (850 hPa >30 kt); enhanced cyclonic vorticity.',
    citation: 'Rajeevan et al. (2010), Pai et al. (2014) IMD MAUSAM'
  },
  Break: {
    label: 'Break Monsoon',
    color: '#F59E0B',
    bgColor: 'rgba(245, 158, 11, 0.15)',
    borderColor: '#D97706',
    criteria: 'Core monsoon zone normalized rainfall anomaly < -1.0 for ≥3 consecutive days.',
    synopticDescription: 'Monsoon trough shifts to Himalayan foothills; rainfall concentrated over NE India and Sub-Himalayan West Bengal, dry elsewhere.',
    citation: 'Ramamurthy (1969), Krishnan et al. (2000)'
  },
  'Depression/Low': {
    label: 'Low / Depression',
    color: '#8B5CF6',
    bgColor: 'rgba(139, 92, 246, 0.15)',
    borderColor: '#7C3AED',
    criteria: 'Low Pressure System (LPS) track within 3° of grid point with wind speeds 17-27 kt (Depression) or <17 kt (Low).',
    synopticDescription: 'Vigorous cyclonic circulation, deep moisture convergence, extreme localized convective rainfall bands along track.',
    citation: 'Sikka (2006), IMD RSMC Tropical Cyclones Archive'
  },
  Other: {
    label: 'Normal / Transition',
    color: '#64748B',
    bgColor: 'rgba(100, 116, 139, 0.15)',
    borderColor: '#475569',
    criteria: 'Does not satisfy Active, Break, or Depression criteria (near climatological mean -1.0σ to +1.0σ).',
    synopticDescription: 'Standard quasi-stationary monsoon flow, localized orographic and diurnal thermal convection.',
    citation: 'MoES Technical Specification Section 13'
  }
};
