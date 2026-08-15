// Supplemental WCAG 2.x contrast verification for DESIGN.md "Dusk Ledger" — amendment 2c
// (Sean's feedback 2026-08-14: purple removed; gradient re-tuned to warm metal register).
// Verifies every text-on-gradient pair for the NEW stops, plus worst-case composites under
// the atmospheric gold washes (gold at <=15% alpha over each stop). Exits 1 on any REQUIRED miss.
const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = hex => { const n = parseInt(hex.slice(1), 16); return 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255); };
const ratio = (a, b) => { const [h, l] = [lum(a), lum(b)].sort((x, y) => y - x); return (h + 0.05) / (l + 0.05); };
// alpha-composite fg over bg (sRGB per-channel, matching browser compositing)
const mix = (fg, bg, a) => {
  const f = parseInt(fg.slice(1), 16), b = parseInt(bg.slice(1), 16);
  const ch = s => Math.round(((f >> s) & 255) * a + ((b >> s) & 255) * (1 - a));
  return '#' + [16, 8, 0].map(s => ch(s).toString(16).padStart(2, '0')).join('');
};

const P = [];
const req = (label, fg, bg, t) => P.push([label, fg, bg, t, true]);
const info = (label, fg, bg, t) => P.push([label, fg, bg, t, false]);

// ---- NEW gradient stops (warm metal, no violet) ----
const LIGHT_STOPS = ['#fdf4e0', '#f8ead1', '#f2e3c6']; // champagne sky -> pale amber -> warm bronze horizon
const DARK_STOPS  = ['#191411', '#241b12', '#38281a']; // deep espresso -> dark bronze -> amber ember horizon
const GOLD = '#dbb155';
const LIGHT_WASH = 0.10; // light-theme atmospheric wash alpha cap
const DARK_WASH = 0.15;  // dark-theme atmospheric wash alpha cap

// ---- LIGHT THEME ----
for (const s of LIGHT_STOPS) {
  req(`light hero ink on gradient stop ${s}`, '#2f2e2a', s, 4.5);
  req(`light hero brass link on gradient stop ${s}`, '#76602f', s, 4.5);
  req(`light hero muted-fg on gradient stop ${s}`, '#66635c', s, 4.5);
  req(`light ring border vs gradient stop ${s} (non-text)`, '#76602f', s, 3.0);
  info(`light bare gold fill vs gradient stop ${s} (why the ring-border rule exists)`, GOLD, s, 3.0);
  // worst-case atmospheric wash composite: gold at 10% over the stop (light-theme cap)
  const w = mix(GOLD, s, LIGHT_WASH);
  req(`light hero ink on stop ${s} + gold wash 10% (=${w})`, '#2f2e2a', w, 4.5);
  req(`light hero brass link on stop ${s} + gold wash 10% (=${w})`, '#76602f', w, 4.5);
  req(`light hero muted-fg on stop ${s} + gold wash 10% (=${w})`, '#66635c', w, 4.5);
  req(`light ring border vs stop ${s} + gold wash 10% (non-text) (=${w})`, '#76602f', w, 3.0);
}

// ---- DARK THEME ----
for (const s of DARK_STOPS) {
  req(`dark hero fg on gradient stop ${s}`, '#eae8e3', s, 4.5);
  req(`dark hero gold-text on gradient stop ${s}`, '#cdb482', s, 4.5);
  req(`dark hero muted-fg on gradient stop ${s}`, '#bab7b0', s, 4.5);
  req(`dark gold pill vs gradient stop ${s} (non-text)`, GOLD, s, 3.0);
  const w = mix(GOLD, s, DARK_WASH);
  req(`dark hero fg on stop ${s} + gold wash 15% (=${w})`, '#eae8e3', w, 4.5);
  req(`dark hero gold-text on stop ${s} + gold wash 15% (=${w})`, '#cdb482', w, 4.5);
  req(`dark hero muted-fg on stop ${s} + gold wash 15% (=${w})`, '#bab7b0', w, 4.5);
  req(`dark gold pill vs stop ${s} + gold wash 15% (non-text) (=${w})`, GOLD, w, 3.0);
}

// ---- Device-frame chrome (new component): frame chrome uses --muted / --secondary on --card;
// address label is --muted-foreground on --muted (light #66635c/#f2f0ed, dark #bab7b0/#232220) ----
req('light frame address label on chrome (--muted-fg on --muted)', '#66635c', '#f2f0ed', 4.5);
req('dark frame address label on chrome (--muted-fg on --muted)', '#bab7b0', '#232220', 4.5);

let fail = 0;
for (const [label, fg, bg, t, required] of P) {
  const r = ratio(fg, bg);
  const ok = r >= t;
  const tag = required ? (ok ? 'PASS' : 'FAIL') : (ok ? 'info-pass' : 'info-fail');
  if (required && !ok) fail++;
  console.log(`${tag.padEnd(9)} ${label}: ${r.toFixed(2)}:1 (target ${t}:1)`);
}
console.log(fail ? `\n${fail} REQUIRED pair(s) FAILED` : '\nAll required pairs PASS');
process.exit(fail ? 1 : 0);
