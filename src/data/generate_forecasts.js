// Script to generate realistic meteorological forecasts for SIH PS 26080
import fs from 'fs';
import path from 'path';

const districts = JSON.parse(fs.readFileSync('./src/data/districts.json', 'utf8'));
const regimesData = JSON.parse(fs.readFileSync('./src/data/regimes.json', 'utf8'));

const allForecasts = [];

regimesData.dailyCalendar.forEach((calDay) => {
  const dateStr = calDay.date;
  const regime = calDay.regime;
  const anomaly = calDay.coreZoneAnomaly;
  
  districts.forEach((d) => {
    let baseObs = 0;
    
    // Simulate physically realistic rainfall patterns based on regime and region
    if (regime === 'Active') {
      if (d.region === 'West Coast' || d.region === 'Western Ghats') {
        baseObs = 60 + Math.sin(d.lat) * 35 + (Math.random() * 25);
      } else if (d.isCoreZone) {
        baseObs = 30 + (d.lon - 73) * 2.5 + (Math.random() * 20);
      } else if (d.region === 'Gangetic Plain') {
        baseObs = 15 + Math.random() * 18;
      } else if (d.region === 'High Orpgraphic') {
        baseObs = 95 + Math.random() * 60;
      } else {
        baseObs = 4 + Math.random() * 12;
      }
    } else if (regime === 'Depression/Low') {
      if (d.id === 'bhu' || d.id === 'sam' || d.id === 'rai' || d.id === 'bil' || d.id === 'jab' || d.id === 'bho') {
        // Direct track of depression
        baseObs = 90 + Math.random() * 85;
      } else if (d.isCoreZone) {
        baseObs = 55 + Math.random() * 45;
      } else if (d.region === 'West Coast') {
        baseObs = 40 + Math.random() * 35;
      } else if (d.region === 'Gangetic Plain') {
        baseObs = 35 + Math.random() * 30;
      } else {
        baseObs = 8 + Math.random() * 15;
      }
    } else if (regime === 'Break') {
      if (d.region === 'Sub-Himalayan WB' || d.region === 'Western Himalaya' || d.region === 'High Orpgraphic' || d.region === 'North East Hills') {
        // Rainfall confined to foothills
        baseObs = 75 + Math.random() * 80;
      } else if (d.region === 'North East') {
        baseObs = 45 + Math.random() * 40;
      } else {
        // Widespread drought / break over central and peninsular India
        baseObs = Math.max(0, (Math.random() * 3.5) - 0.5);
      }
    } else {
      // Normal / Other
      if (d.region === 'West Coast') {
        baseObs = 25 + Math.random() * 25;
      } else if (d.region === 'High Orpgraphic') {
        baseObs = 55 + Math.random() * 40;
      } else {
        baseObs = 5 + Math.random() * 15;
      }
    }

    const obs = parseFloat(baseObs.toFixed(1));
    
    // Model 1: Raw GFS (has known wet bias on Ghats, spatial displacement on depression tracks, and over-forecasts in breaks)
    let rawFactor = 1.25;
    if (d.region === 'West Coast') rawFactor = 1.45; // Orographic excessive precipitation
    if (regime === 'Break' && !d.region.includes('Himalaya') && !d.region.includes('North East')) {
      rawFactor = 4.0; // High false alarms in break spells
    }
    const b1_raw = parseFloat(Math.max(0, (obs * rawFactor + (Math.random() * 12 - 5))).toFixed(1));
    
    // Model 2: Quantile Mapping (corrects general mean scaling, but lacks spatial/regime dynamic awareness)
    const b2_qm = parseFloat(Math.max(0, (b1_raw * 0.78 + (Math.random() * 8 - 4))).toFixed(1));
    
    // Model 3: Generic XGBoost (improves using local features, but doesn't distinguish synoptic state)
    const b3_err = (Math.random() * 8 - 4);
    const b3_xgb = parseFloat(Math.max(0, (obs * 0.92 + b3_err)).toFixed(1));
    
    // Model 4: Regime-Aware XGBoost (conditioned on active/break/depression anomaly)
    const b4_err = (Math.random() * 4 - 2);
    const b4_regime_xgb = parseFloat(Math.max(0, (obs * 0.98 + b4_err)).toFixed(1));
    
    // Calibrated probability of heavy rain (> 64.5 mm)
    let prob_heavy = 0.02;
    if (b4_regime_xgb > 75) prob_heavy = 0.88 + Math.random() * 0.10;
    else if (b4_regime_xgb > 60) prob_heavy = 0.65 + Math.random() * 0.18;
    else if (b4_regime_xgb > 45) prob_heavy = 0.38 + Math.random() * 0.15;
    else if (b4_regime_xgb > 25) prob_heavy = 0.12 + Math.random() * 0.10;
    prob_heavy = parseFloat(Math.min(0.99, Math.max(0.01, prob_heavy)).toFixed(2));
    
    // Calibrated probability of very heavy rain (> 115.6 mm)
    let prob_vheavy = 0.01;
    if (b4_regime_xgb > 130) prob_vheavy = 0.82 + Math.random() * 0.14;
    else if (b4_regime_xgb > 100) prob_vheavy = 0.54 + Math.random() * 0.15;
    else if (b4_regime_xgb > 70) prob_vheavy = 0.22 + Math.random() * 0.12;
    prob_vheavy = parseFloat(Math.min(0.98, Math.max(0.005, prob_vheavy)).toFixed(2));
    
    allForecasts.push({
      id: `${dateStr}_${d.id}`,
      districtId: d.id,
      districtName: d.name,
      state: d.state,
      lat: d.lat,
      lon: d.lon,
      isCoreZone: d.isCoreZone,
      region: d.region,
      forecast_init: `${dateStr} 00:00 UTC`,
      valid_date: dateStr,
      lead_time: 24,
      b1_raw,
      b2_qm,
      b3_xgb,
      b4_regime_xgb,
      observed_rain: obs,
      regime,
      anomaly_sigma: anomaly,
      prob_heavy_64_5: prob_heavy,
      prob_very_heavy_115_6: prob_vheavy,
      temp_2m_c: parseFloat((26.5 + Math.random() * 6).toFixed(1)),
      rh_2m_pct: parseFloat((78 + Math.random() * 18).toFixed(1)),
      wind_speed_ms: parseFloat((4.5 + Math.random() * 9).toFixed(1)),
      cape_jkg: Math.round(1100 + Math.random() * 1600)
    });
  });
});

fs.writeFileSync('./src/data/forecasts.json', JSON.stringify(allForecasts, null, 2));
console.log(`Generated ${allForecasts.length} forecast records.`);
