// Minimal brewing control chart: a 3x3 grid (Under/Ideal/Over extraction
// yield x Weak/Ideal/Strong TDS) with a single dot marking where a brew
// landed. Colors pull from the app's own CSS variables (style.css) rather
// than the original calculator's green/red palette — the dot's own fill
// (set in updateChart, via qualityColor's red-to-green hue) is what
// signals good/bad; the grid itself stays neutral to match the rest of
// the UI.


export function chartMarkup() {
  return `
    <div class="chart">
      <div class="chart__title">Brewing Control Chart</div>
      <svg class="chart__svg" viewBox="0 0 320 280" xmlns="http://www.w3.org/2000/svg">
        <rect x="40" y="20" width="260" height="220" rx="10" ry="10" fill="#fff" stroke="rgba(43,26,16,0.15)" stroke-width="1"/>
        <rect x="126.67" y="80" width="86.67" height="80" style="fill:var(--gold);opacity:0.18"/>
        <line x1="126.67" y1="20" x2="126.67" y2="240" stroke="rgba(43,26,16,0.15)" stroke-width="1" stroke-dasharray="2,3"/>
        <line x1="213.33" y1="20" x2="213.33" y2="240" stroke="rgba(43,26,16,0.15)" stroke-width="1" stroke-dasharray="2,3"/>
        <line x1="40" y1="80" x2="300" y2="80" stroke="rgba(43,26,16,0.15)" stroke-width="1" stroke-dasharray="2,3"/>
        <line x1="40" y1="160" x2="300" y2="160" stroke="rgba(43,26,16,0.15)" stroke-width="1" stroke-dasharray="2,3"/>
        <text x="170" y="265" text-anchor="middle" font-size="10" font-weight="700" style="fill:var(--brown-700)">EXTRACTION YIELD %</text>
        <text x="83" y="255" text-anchor="middle" font-size="9" style="fill:var(--ink);opacity:0.6">Under</text>
        <text x="170" y="255" text-anchor="middle" font-size="9" font-weight="700" style="fill:var(--purple-ink)">Ideal</text>
        <text x="256" y="255" text-anchor="middle" font-size="9" style="fill:var(--ink);opacity:0.6">Over</text>
        <text x="18" y="120" text-anchor="middle" font-size="10" font-weight="700" style="fill:var(--brown-700)" transform="rotate(-90, 18, 130)">TDS %</text>
        <text x="30" y="50" text-anchor="end" font-size="9" style="fill:var(--ink);opacity:0.6">Strong</text>
        <text x="30" y="125" text-anchor="end" font-size="9" font-weight="700" style="fill:var(--purple-ink)">Ideal</text>
        <text x="30" y="205" text-anchor="end" font-size="9" style="fill:var(--ink);opacity:0.6">Weak</text>
        <circle class="chart__dot" cx="170" cy="120" r="9" fill="#2e5339" stroke="#fff" stroke-width="2.5"/>
      </svg>
    </div>
  `;
}
 

// Moves the dot to a given { x, y } (as returned by dotPosition() in
// espresso-quality.js) and recolors it to match the quality indicator.
export function updateChart(root, { x, y }, color) {
  const dot = root.querySelector('.chart__dot');
  if (!dot) return;
  dot.setAttribute('cx', x);
  dot.setAttribute('cy', y);
  if (color) dot.setAttribute('fill', color);
}