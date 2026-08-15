// Supplemental WCAG 2.x contrast verification for DESIGN.md "Dusk Ledger" (Phase 2 re-deal).
// Exits 1 if any REQUIRED pair misses its target. Informational pairs are printed, never gate.
const lin = c => { c /= 255; return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); };
const lum = hex => { const n = parseInt(hex.slice(1), 16); return 0.2126 * lin(n >> 16) + 0.7152 * lin((n >> 8) & 255) + 0.0722 * lin(n & 255); };
const ratio = (a, b) => { const [h, l] = [lum(a), lum(b)].sort((x, y) => y - x); return (h + 0.05) / (l + 0.05); };

const P = []; // [label, fgHex, bgHex, target, required]
const req = (label, fg, bg, t) => P.push([label, fg, bg, t, true]);
const info = (label, fg, bg, t) => P.push([label, fg, bg, t, false]);

// ---- LIGHT THEME (page #f9f9f7 n2, card #fdfdfc n1) ----
req('light body fg on bg', '#2f2e2a', '#f9f9f7', 4.5);
req('light body fg on card', '#2f2e2a', '#fdfdfc', 4.5);
req('light muted-fg on bg', '#66635c', '#f9f9f7', 4.5);
req('light primary-text (brass) on bg', '#76602f', '#f9f9f7', 4.5);
req('light primary-text (brass) on card', '#76602f', '#fdfdfc', 4.5);
req('light accent-fg on accent tint', '#76602f', '#f9efdd', 4.5);
req('light ink on gold (CTA pill)', '#110d04', '#dbb155', 4.5);
req('light destructive text on bg', '#974843', '#f9f9f7', 4.5);
req('light white on destructive fill', '#ffffff', '#974843', 4.5);
req('light white on success fill', '#ffffff', '#337437', 4.5);
req('light win text on bg', '#337437', '#f9f9f7', 4.5);
req('light loss text on bg', '#974843', '#f9f9f7', 4.5);
req('light input border vs bg (non-text)', '#66635c', '#f9f9f7', 3.0);
req('light ring vs card (non-text)', '#76602f', '#fdfdfc', 3.0);
// Gradient hero, light: stops #fdf4e4 -> #f4e4da -> #e9e2f0
for (const s of ['#fdf4e4', '#f4e4da', '#e9e2f0']) {
  req(`light hero ink on gradient stop ${s}`, '#2f2e2a', s, 4.5);
  req(`light hero brass link on gradient stop ${s}`, '#76602f', s, 4.5);
  req(`light hero muted-fg on gradient stop ${s}`, '#66635c', s, 4.5);
  req(`light ring border vs gradient stop ${s} (non-text)`, '#76602f', s, 3.0);
  info(`light bare gold fill vs gradient stop ${s} (why the ring-border rule exists)`, '#dbb155', s, 3.0);
}
// Scrim: >=85% --card over worst stop; composite ~ card, judged as text-on-card (already required above).

// ---- DARK THEME (page #131312 n1, card #1a1918 n2) ----
req('dark body fg on bg', '#eae8e3', '#131312', 4.5);
req('dark body fg on card', '#eae8e3', '#1a1918', 4.5);
req('dark muted-fg on bg', '#bab7b0', '#131312', 4.5);
req('dark primary-text on bg', '#cdb482', '#131312', 4.5);
req('dark primary-text on card', '#cdb482', '#1a1918', 4.5);
req('dark accent-fg on accent tint', '#cdb482', '#282113', 4.5);
req('dark ink on gold (CTA pill)', '#110d04', '#dbb155', 4.5);
req('dark ink fg on destructive fill', '#131312', '#e1524f', 4.5);
req('dark loss text on bg', '#f49c95', '#131312', 4.5);
req('dark loss text on card', '#f49c95', '#1a1918', 4.5);
req('dark win text on bg', '#88cb8a', '#131312', 4.5);
req('dark ink on success fill', '#131312', '#5ad664', 4.5);
req('dark input border vs bg (non-text)', '#7a756a', '#131312', 3.0);
req('dark ring (gold) vs bg (non-text)', '#dbb155', '#131312', 3.0);
// Gradient hero, dark: stops #1c1626 -> #2c2130 -> #3a2a26
for (const s of ['#1c1626', '#2c2130', '#3a2a26']) {
  req(`dark hero fg on gradient stop ${s}`, '#eae8e3', s, 4.5);
  req(`dark hero gold-text on gradient stop ${s}`, '#cdb482', s, 4.5);
  req(`dark hero muted-fg on gradient stop ${s}`, '#bab7b0', s, 4.5);
  req(`dark gold pill vs gradient stop ${s} (non-text)`, '#dbb155', s, 3.0);
}

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
