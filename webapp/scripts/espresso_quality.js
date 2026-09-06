// Espresso extraction model — adapted from a generic multi-method brewing
// calculator, trimmed to espresso only, with a continuous (stepless) grind
// scale instead of a discrete 1–10 slider, and a fixed 18g dose.
//
// Grind scale: 5 (Very Fine) .. 30 (Very Coarse), continuous.
// Dose: always 18g (this rig only pulls one dose size).

const DOSE = 18;

const GRIND_MIN = 5;
const GRIND_MAX = 30;

// Roast affects how much is pulled out of the grounds for a given
// time/grind/temp. Five-point scale, extrapolated symmetrically from the
// original calculator's light/medium/dark three-point scale.
const ROAST_MOD = {
  light:          { eyMul: 1.06 },
  'medium-light': { eyMul: 1.03 },
  medium:         { eyMul: 1.00 },
  'medium-dark':  { eyMul: 0.97 },
  dark:           { eyMul: 0.94 },
};

const clamp = (n, low, high) => Math.min(high, Math.max(low, n));

// Maps the continuous 5–30 grind scale onto the original calculator's 1–10
// espresso grind scale, then applies its grind-factor formula. This keeps
// the underlying extraction math identical to the source calculator; only
// the input scale changed.
function grindFactor(grind) {
  const g = clamp(grind, GRIND_MIN, GRIND_MAX);
  const oldScale = 1 + ((g - GRIND_MIN) / (GRIND_MAX - GRIND_MIN)) * 9; // 1..10
  return (11 - oldScale) / 5;
}

// A human-readable label for the current grind position. Purely cosmetic —
// not used in any of the math below.
const GRIND_LABELS = [
  { max: 9, label: 'Very Fine' },
  { max: 13, label: 'Fine' },
  { max: 17, label: 'Medium-Fine' },
  { max: 21, label: 'Medium' },
  { max: 25, label: 'Medium-Coarse' },
  { max: 30, label: 'Coarse' },
];
export function grindLabel(grind) {
  const g = clamp(grind, GRIND_MIN, GRIND_MAX);
  const found = GRIND_LABELS.find((row) => g <= row.max);
  return found ? found.label : 'Very Coarse';
}

// Core estimate: brew ratio, TDS%, and extraction yield %.
export function estimateExtraction({ quantity, time, grind, temperature, roast = 'medium' }) {
  const ratio = quantity / DOSE;
  const timeFactor = clamp(time / 28, 0.6, 1.5);
  const gFactor = grindFactor(grind);
  const tempFactor = 1 + (temperature - 93) * 0.015;

  let tds = 9.5 * (1 / ratio) * 2 * timeFactor * gFactor * tempFactor;
  let ey = ((tds * quantity) / DOSE) * 0.85;

  const mod = ROAST_MOD[roast] || ROAST_MOD.medium;
  ey *= mod.eyMul;

  tds = clamp(tds, 5, 14);
  ey = clamp(ey, 14, 28);

  return { tds, ey, ratio };
}

// Where the brew sits relative to the standard espresso control-chart bands.
export function getZone(tds, ey) {
  const eyZone = ey < 18 ? 'under' : ey > 22 ? 'over' : 'ideal';
  const tdsZone = tds < 7.5 ? 'weak' : tds > 12 ? 'strong' : 'ideal';
  return { eyZone, tdsZone };
}

// Score 0–1 for a single axis: 1 inside the sweet zone, tapering linearly
// to 0 at the outer (red) bound on either side. Same shape as the existing
// qualityScore() you already use for extraction time alone.
function axisScore(value, sweetLow, sweetHigh, redLow, redHigh) {
  if (value >= sweetLow && value <= sweetHigh) return 1;
  if (value < sweetLow) return clamp((value - redLow) / (sweetLow - redLow), 0, 1);
  return clamp((redHigh - value) / (redHigh - sweetHigh), 0, 1);
}

// Collapses the two-axis chart (TDS x EY) into one 0–1 score. Uses the
// weaker of the two axes rather than an average, so a brew can't look
// "great" overall just by being perfect on one axis while badly off on
// the other — both strength and extraction have to be in range.
export function qualityScore({ quantity, time, grind, temperature, roast }) {
  const { tds, ey } = estimateExtraction({ quantity, time, grind, temperature, roast });
  const eyScore = axisScore(ey, 18, 22, 14, 28);
  const tdsScore = axisScore(tds, 7.5, 12, 5, 14);
  return Math.min(eyScore, tdsScore);
}

export function qualityColor(score) {
  const hue = score * 120;
  return `hsl(${hue.toFixed(0)}, 72%, 46%)`;
}

export function qualityLabel(score) {
  if (score >= 0.85) return 'Exquisite';
  if (score >= 0.65) return 'Great';
  if (score >= 0.4) return 'Average';
  return 'Poor';
}

// x/y position (within the 320x280 chart viewBox used by extraction-chart.js)
// for plotting a TDS/EY pair as a dot.
export function dotPosition(tds, ey) {
  const xMin = 14, xMax = 28;
  const x = 40 + ((clamp(ey, xMin, xMax) - xMin) / (xMax - xMin)) * 260;
  const yMin = 5, yMax = 14;
  const y = 240 - ((clamp(tds, yMin, yMax) - yMin) / (yMax - yMin)) * 220;
  return { x, y };
}

// Everything the view needs in one call.
export function getQualityIndicator({ quantity, time, grind, temperature, roast }) {
  const { tds, ey, ratio } = estimateExtraction({ quantity, time, grind, temperature, roast });
  const score = qualityScore({ quantity, time, grind, temperature, roast });
  const zones = getZone(tds, ey);
  const pos = dotPosition(tds, ey);
  return {
    score,
    color: qualityColor(score),
    label: qualityLabel(score),
    tds,
    ey,
    ratio,
    zones,
    dot: pos,
  };
}