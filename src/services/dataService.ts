// Data Service Layer (Abstracts Mock vs Real API Backend)
import { USE_MOCK_DATA } from '../config';
import districtsData from '../data/districts.json';
import forecastsData from '../data/forecasts.json';
import metricsData from '../data/metrics.json';
import regimesData from '../data/regimes.json';
import probabilitiesData from '../data/probabilities.json';
import { WeatherForecastRecord, DistrictData, RegimeCalendarDay } from '../types/weather';

export class WeatherDataService {
  /**
   * Get all registered districts
   */
  static async getDistricts(): Promise<DistrictData[]> {
    if (USE_MOCK_DATA) {
      return districtsData as DistrictData[];
    }
    // Future backend API: return fetch('/api/v1/districts').then(res => res.json());
    throw new Error('Real backend not configured. Set USE_MOCK_DATA = true.');
  }

  /**
   * Get all forecast records for a specific date (YYYY-MM-DD)
   */
  static async getForecastsByDate(dateStr: string): Promise<WeatherForecastRecord[]> {
    if (USE_MOCK_DATA) {
      const records = (forecastsData as WeatherForecastRecord[]).filter(
        (f) => f.valid_date === dateStr
      );
      return records;
    }
    throw new Error('Real backend not configured.');
  }

  /**
   * Get available monsoon calendar dates
   */
  static async getMonsoonCalendar(): Promise<RegimeCalendarDay[]> {
    if (USE_MOCK_DATA) {
      return regimesData.dailyCalendar as RegimeCalendarDay[];
    }
    throw new Error('Real backend not configured.');
  }

  /**
   * Get regimes distribution and synoptic data
   */
  static async getRegimesData() {
    if (USE_MOCK_DATA) {
      return regimesData;
    }
    throw new Error('Real backend not configured.');
  }

  /**
   * Get verification metrics data
   */
  static async getMetricsData() {
    if (USE_MOCK_DATA) {
      return metricsData;
    }
    throw new Error('Real backend not configured.');
  }

  /**
   * Get extreme rainfall probability curves and scores
   */
  static async getProbabilitiesData() {
    if (USE_MOCK_DATA) {
      return probabilitiesData;
    }
    throw new Error('Real backend not configured.');
  }

  /**
   * Export district forecasts to CSV formatted string
   */
  static exportToCSV(records: WeatherForecastRecord[]): void {
    const headers = [
      'District',
      'State',
      'Latitude',
      'Longitude',
      'Valid Date',
      'Regime',
      'B1_Raw_GFS_mm',
      'B2_QuantileMapping_mm',
      'B3_XGBoost_mm',
      'B4_RegimeAware_mm',
      'IMD_Observed_mm',
      'Heavy_Rain_Prob_Pct',
      'Very_Heavy_Rain_Prob_Pct'
    ];

    const rows = records.map((r) => [
      `"${r.districtName}"`,
      `"${r.state}"`,
      r.lat,
      r.lon,
      r.valid_date,
      `"${r.regime}"`,
      r.b1_raw,
      r.b2_qm,
      r.b3_xgb,
      r.b4_regime_xgb,
      r.observed_rain,
      (r.prob_heavy_64_5 * 100).toFixed(0) + '%',
      (r.prob_very_heavy_115_6 * 100).toFixed(0) + '%'
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `MonsoonAI_Forecast_${records[0]?.valid_date || 'export'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
