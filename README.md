# MonsoonAI: Regime-Aware AI Post-Processing of Monsoon Rainfall Forecasts
### Smart India Hackathon — Problem Statement 26080
**Ministry of Earth Sciences (MoES) / National Centre for Medium Range Weather Forecasting (NCMRWF)**

A production-grade, visually striking meteorological operations center web application demonstrating how raw Numerical Weather Prediction (NWP) rainfall forecasts (NOAA GFS 0.25°) are systematically improved through statistical bias correction (Quantile Mapping), generic Machine Learning (XGBoost), and synoptic **regime-aware AI post-processing**, verified against IMD 0.25° gridded observations.

---

## ⚡ Quick Start

### 1. Requirements
- Node.js (v18+ recommended, v24 tested)
- npm (v9+)

### 2. Installation & Running

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
npm run preview
```

---

## 🛰️ Key Features & Pages

1. **Operations Dashboard (`/dashboard`)**:
   - Interactive India Map with IMD rainfall color classification (0.25° NetCDF grid simulation or district choropleth).
   - Time-series playback stepper through June–September monsoon dates.
   - Live Synoptic Circulation State badge (Active / Break / Depression / Normal) with core monsoon zone anomaly tracking.
   - Selected district diagnostic gauge (Temperature, Humidity, Wind speed, CAPE, error delta).
   - Searchable, sortable district table with instantaneous CSV export for operational reporting.

2. **Model Benchmark & Multi-Metric Verification (`/model-comparison`)**:
   - Synchronized side-by-side or interactive curtain swipe comparison: **Raw GFS (B1)** vs **IMD Ground Truth** vs **Regime-Aware AI (B4)**.
   - Multi-threshold categorical metrics: CSI (Threat Score), POD (Hit Rate), FAR (False Alarm), ETS across 1 mm, 10 mm, 50 mm, and 100 mm.
   - Stepwise progression proving B1 → B2 → B3 → B4 performance gain.

3. **Weather Regimes & Monsoon Dynamics (`/regimes`)**:
   - Full JJAS monsoon calendar heatmap color-coded by synoptic state.
   - Core Monsoon Zone (21°–27°N, 73°–82°E) normalized rainfall anomaly time-series with $\pm 1.0\sigma$ threshold criteria.
   - Literature definition cards referencing published criteria (Rajeevan et al., Pai et al., Sikka).

4. **Heavy Rainfall Probability & Uncertainty (`/heavy-rain-prob`)**:
   - Spatial exceedance probability map: $P(\text{Rain} > 64.5\text{ mm})$.
   - Reliability diagram (calibration curve) showing tight alignment of B4 along the 1:1 diagonal.
   - Receiver Operating Characteristic (ROC) curve showing an AUC of 0.90 (vs 0.72 for raw GFS).
   - Dynamic threshold slider (15.6 mm to 115.6 mm).

5. **Extreme Event Verification & Spatial Scale (`/verification`)**:
   - Categorical stratification by IMD intensity (Trace, Moderate, Heavy, Very Heavy).
   - Sample size disclosure warning badge highlighting class imbalance on rare extreme events ($N=243$).
   - Fractions Skill Score (FSS) scaling across spatial neighborhood windows ($3\times3$, $5\times5$, $7\times7$).

6. **Methodology & Data Pipeline (`/methodology`)**:
   - 16-stage interactive horizontal workflow architecture diagram.
   - Data source specifications for NOAA GFS 0.25° AWS S3 archive and IMD NetCDF 0.25° daily gridded dataset.
   - Train (2020–2022) / Validation (2023) / Test (2024) timeline avoiding temporal leakage.

7. **Scientific Integrity: Claims & Boundaries (`/limitations`)**:
   - Transparent two-column breakdown of what this project claims vs what it does NOT claim.
   - Fallback hierarchy (Level 1 Ideal to Level 4 Prototype).

---

## 🔄 Replacing Mock Data with Real Model Outputs

The frontend is built with a decoupled Data Service Layer (`src/services/dataService.ts`) and configured via `src/config.ts`.

### Steps to connect real model outputs:
1. Open `src/config.ts` and set:
   ```typescript
   export const USE_MOCK_DATA = false;
   ```
2. Replace or update the JSON files in `src/data/`:
   - `districts.json`: District coordinates and metadata.
   - `forecasts.json`: Array of records containing:
     ```json
     {
       "id": "2023-07-05_mum",
       "districtId": "mum",
       "districtName": "Mumbai Suburban",
       "state": "Maharashtra",
       "lat": 19.076,
       "lon": 72.8777,
       "valid_date": "2023-07-05",
       "b1_raw": 112.4,
       "b2_qm": 84.1,
       "b3_xgb": 76.8,
       "b4_regime_xgb": 68.2,
       "observed_rain": 66.5,
       "regime": "Active",
       "prob_heavy_64_5": 0.78
     }
     ```
   - `metrics.json`: Verification scores (RMSE, CSI, POD, FAR, ETS, FSS).
   - `regimes.json`: Daily calendar dates and core monsoon zone anomaly values.
   - `probabilities.json`: Reliability diagram and ROC curve coordinates.
3. Alternatively, implement direct REST API endpoints in `src/services/dataService.ts` by pointing fetch calls to your Python FastAPI or Flask backend serving NetCDF inference results.

---

## 🎨 Theme & Visual Palette

- **Theme**: Dark "weather operations center" aesthetic (`#0B1220`) with glowing accents (`#22D3EE` cyan, indigo, amber) and full light-mode toggle.
- **Rainfall Palette (IMD Standard)**:
  - No / Trace Rain ($< 2.5\text{ mm}$): Slate `#334155`
  - Light Rain ($2.5 - 15.5\text{ mm}$): Sky Blue `#38BDF8`
  - Moderate Rain ($15.6 - 64.4\text{ mm}$): Green `#22C55E`
  - Heavy Rain ($64.5 - 115.5\text{ mm}$): Yellow `#EAB308`
  - Very Heavy Rain ($115.6 - 204.4\text{ mm}$): Orange `#F97316`
  - Extremely Heavy Rain ($\ge 204.5\text{ mm}$): Deep Purple `#9333EA`

---

## 📜 Citations & Official References
- **IMD Gridded Rainfall:** Pai et al. (2014), *MAUSAM*, 65, 1, pp. 1–18.
- **Monsoon Regimes:** Rajeevan et al. (2010), *J. Earth Syst. Sci.*, 119, 3, pp. 229–247.
- **Spatial Verification (FSS):** Roberts & Lean (2008), *Monthly Weather Review*, 136, 7, pp. 2541–2557.
- **NWP Model:** NOAA NCEP Global Forecast System (GFS 0.25°), AWS Open Data Program.
