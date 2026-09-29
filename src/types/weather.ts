// Weather and Model TypeScript Definitions

export type RegimeType = 'Active' | 'Break' | 'Depression/Low' | 'Other';

export interface DistrictData {
  id: string;
  name: string;
  state: string;
  lat: number;
  lon: number;
  isCoreZone: boolean;
  svgPath?: string; // Vector polygon / approximate boundary coordinates
}

export interface WeatherForecastRecord {
  id: string;
  districtId: string;
  districtName: string;
  state: string;
  lat: number;
  lon: number;
  isCoreZone: boolean;
  region: string;
  forecast_init: string; // e.g. "2023-07-15 00:00 UTC"
  valid_date: string;    // e.g. "2023-07-16"
  lead_time: number;     // e.g. 24
  
  // Model Predictions (mm / 24h)
  b1_raw: number;
  b2_qm: number;
  b3_xgb: number;
  b4_regime_xgb: number;
  observed_rain: number;
  
  // Regime context
  regime: RegimeType;
  anomaly_sigma: number; // e.g. +1.42
  
  // Calibrated Exceedance Probabilities (0.0 to 1.0)
  prob_heavy_64_5: number;
  prob_very_heavy_115_6: number;
  
  // Physical atmospheric variables
  temp_2m_c: number;
  rh_2m_pct: number;
  wind_speed_ms: number;
  cape_jkg: number;
}

export interface MetricComparison {
  metric: string;
  name: string;
  unit: string;
  b1_raw: number;
  b2_qm: number;
  b3_xgb: number;
  b4_regime_xgb: number;
  bestModel: 'b1_raw' | 'b2_qm' | 'b3_xgb' | 'b4_regime_xgb';
  improvementPct: number;
  description: string;
  direction: 'lower' | 'higher';
}

export interface ThresholdMetric {
  threshold: number; // e.g., 1, 10, 50, 100 mm
  metrics: MetricComparison[];
}

export interface RegimeCalendarDay {
  date: string; // YYYY-MM-DD
  dayOfWeek: string;
  regime: RegimeType;
  coreZoneAnomaly: number; // normalized rainfall anomaly (-2.5 to +3.5)
  monsoonTroughStatus: string;
  activeLpsCount: number;
  allIndiaMeanRainfallMm: number;
}

export interface CalibrationCurvePoint {
  binMidpoint: number; // e.g. 0.05, 0.15, ... 0.95
  forecastProbability: number;
  observedRelativeFrequencyB1: number;
  observedRelativeFrequencyB4: number;
  sampleCount: number;
}

export interface CurvePoint {
  threshold: number;
  fpr: number;
  tpr: number;
  precision: number;
  recall: number;
}

export interface CategoryVerification {
  category: string;
  rainfallRange: string;
  sampleCount: number;
  sampleRatioPct: number;
  rmseB1: number;
  rmseB4: number;
  podB1: number;
  podB4: number;
  farB1: number;
  farB4: number;
  sampleWarning?: boolean;
}

export interface FssNeighborhoodRecord {
  neighborhood: string;
  gridDegrees: string;
  kmScale: number;
  fss10mmB1: number;
  fss10mmB4: number;
  fss50mmB1: number;
  fss50mmB4: number;
  fss100mmB1: number;
  fss100mmB4: number;
}
