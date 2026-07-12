const SWEET_LOW = 23;
const SWEET_HIGH = 27;
const RED_LOW = 10;
const RED_HIGH = 40;

const clamp = (n, low, high) => Math.min(high, Math.max(low, n));

export function qualityScore(seconds) {
 const t = Number(seconds);
 if (!Number.isFinite(t)) {
    return 0;
 }
 if (t >= SWEET_LOW && t <= SWEET_HIGH) {
    return 1;
 } 
 if (t < SWEET_LOW) {
    return clamp((t - RED_LOW)/ (SWEET_LOW - RED_LOW), 0, 1);
 } 
 return clamp((RED_HIGH - t) / (RED_HIGH - SWEET_HIGH), 0, 1);
}

export function qualityColor(score) {
    const hue = score * 120;
    return `hsl(${hue.toFixed(0)}, 72%, 46%)`;
}

export function qualityLabel(score) {
    if (score >= 0.75) {
        return 'Great';
    }
    if (score >= '0.4') {
        return 'Average';
    }
    return 'Poor';
}

export function quality(seconds) {
  const score = qualityScore(seconds);
  return { score, color: qualityColor(score), label: qualityLabel(score) }; 
}