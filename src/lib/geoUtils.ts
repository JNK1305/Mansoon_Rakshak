// Geographic and Color Helper Utilities

// Bounding box for India map visualization
export const GEO_BOUNDS = {
  minLat: 7.5,
  maxLat: 36.5,
  minLon: 68.0,
  maxLon: 97.5,
};

// India border polygon SVG path approximation (clean, aesthetic silhouette)
export const INDIA_OUTLINE_PATH = `
  M 280 60
  C 290 50, 310 40, 330 45
  C 350 50, 360 70, 365 95
  C 380 110, 420 140, 450 150
  C 480 155, 520 160, 560 180
  C 600 200, 640 210, 680 205
  C 710 200, 740 220, 755 240
  C 770 260, 760 280, 735 295
  C 700 310, 670 300, 650 320
  C 630 340, 610 355, 595 380
  C 580 400, 560 410, 545 430
  C 530 450, 520 480, 515 510
  C 510 540, 490 570, 475 600
  C 460 630, 440 670, 420 710
  C 400 750, 380 790, 360 830
  C 350 850, 340 855, 335 845
  C 320 810, 305 760, 290 710
  C 275 660, 260 610, 245 560
  C 230 520, 210 490, 190 460
  C 160 440, 130 435, 110 450
  C 95 465, 80 460, 85 430
  C 95 400, 115 370, 140 340
  C 160 310, 175 280, 185 240
  C 195 200, 205 170, 220 140
  C 235 110, 260 80, 280 60
  Z
`;

export function projectCoordinates(lat: number, lon: number, width = 800, height = 900) {
  // Linear equirectangular projection bounded to India domain
  const x = ((lon - GEO_BOUNDS.minLon) / (GEO_BOUNDS.maxLon - GEO_BOUNDS.minLon)) * (width * 0.85) + (width * 0.08);
  const y = ((GEO_BOUNDS.maxLat - lat) / (GEO_BOUNDS.maxLat - GEO_BOUNDS.minLat)) * (height * 0.85) + (height * 0.06);
  return { x, y };
}

export function getRainfallColor(rainfallMm: number): { hex: string; label: string; textDark: boolean } {
  if (rainfallMm < 2.5) {
    return { hex: '#334155', label: 'No/Trace (<2.5mm)', textDark: false };
  } else if (rainfallMm < 15.6) {
    return { hex: '#38BDF8', label: 'Light (2.5-15.5mm)', textDark: true };
  } else if (rainfallMm < 64.5) {
    return { hex: '#22C55E', label: 'Moderate (15.6-64.4mm)', textDark: true };
  } else if (rainfallMm < 115.6) {
    return { hex: '#EAB308', label: 'Heavy (64.5-115.5mm)', textDark: true };
  } else if (rainfallMm < 204.5) {
    return { hex: '#F97316', label: 'Very Heavy (115.6-204.4mm)', textDark: false };
  } else {
    return { hex: '#9333EA', label: 'Extremely Heavy (≥204.5mm)', textDark: false };
  }
}

export function getProbabilityColor(prob: number): string {
  if (prob < 0.15) return '#334155';
  if (prob < 0.35) return '#38BDF8';
  if (prob < 0.60) return '#F59E0B';
  if (prob < 0.80) return '#F97316';
  return '#EF4444';
}
