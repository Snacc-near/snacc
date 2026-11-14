/* Shared shell for the Snacc docs figures.
   The five figures are built on the Colorfigures engine (MIT, April Zhu), which is inlined in each page.
   This file only adds the Snacc look (cream and amber paper, ink black, amber accent, green status dot),
   a quieter page chrome for embedding, reduced-motion handling, and a few small geometry helpers.
   Every global name here starts with sf / SF so it cannot clash with the engine's reserved names. */

const SF_REDUCED = typeof matchMedia === 'function' && matchMedia('(prefers-reduced-motion: reduce)').matches;
const sfMs = ms => (SF_REDUCED ? 1 : ms);                   // animation length: instant when the reader prefers reduced motion
const sfAmbient = !SF_REDUCED;                               // idle motion (blinking, bobbing, flames) only without the preference

/* palettes: amber is the Snacc body colour, the others are small accents */
const SFC = {
  amber:  { l: '#ffd57a', m: '#f2b230', d: '#8a5a0a' },
  cream:  { l: '#fffaf0', m: '#efe3c3', d: '#bfa974' },
  agar:   { l: '#f7edcc', m: '#ecdca8', d: '#c9b57a' },
  mint:   { l: '#a6dfc0', m: '#6fbf8d', d: '#1f4a34' },
  tomato: { l: '#f2826a', m: '#d9573f', d: '#5a2418' },
  frost:  { l: '#b4dde8', m: '#76b9cb', d: '#1e4a56' },
  glass:  { l: '#e8f4f2', m: '#cfe6e4', d: '#9dbdbb' },
  steel:  { l: '#eef0f0', m: '#c6ccce', d: '#8f989b' },
  ink:    { l: '#6a6358', m: '#4a443b', d: '#2a261f' },
};
PALS.snacc = SFC.amber;
const SF_BOARD = { l: '#fff1cd', m: '#f2e1b3', d: '#cdb780' };
const SF_GREEN = '#43c25c', SF_RED = '#d94135', SF_PAPER = '#fbfaf5', SF_PILL = '#fff4d6';

/* page chrome for the embedded plate: transparent-looking paper, no header, no wobble or colour controls, keycap buttons */
(function sfStyle() {
  const css = `
  html{height:auto;background-color:${SF_PAPER};background-image:radial-gradient(rgba(22,24,26,.12) 1px,transparent 1px);background-size:18px 18px;color-scheme:light}
  html body{height:auto;min-height:0;margin:0;background:none;padding:6px 10px 10px;overflow-x:hidden}
  html body > header{display:none}
  html body .controls{border-top:0;padding-top:2px;margin:0;gap:8px 20px}
  html body .controls .ctl:has(#wb),html body .controls .ctl:has(#pals){display:none}
  html body .controls .ctl > label{font-size:10.5px}
  html body .controls button{border-radius:8px;font-weight:700;font-size:12px;padding:5px 12px;background:${SF_PILL};box-shadow:0 2px 0 var(--ink)}
  html body .controls button[aria-pressed=true]{background:var(--ink);color:${SF_PAPER}}
  html body .act{border-radius:8px;font-weight:700;background:${SF_PILL};box-shadow:0 3px 0 var(--ink);transition:transform .06s,box-shadow .06s,background .15s}
  html body .act:hover{background:#ffe9a6}
  html body .act:active{transform:translateY(2px);box-shadow:0 1px 0 var(--ink)}
  html body .act:focus-visible,html body .controls button:focus-visible,html body input:focus-visible{outline:2px solid #f8aa06;outline-offset:3px}
  html body .act.sf-go{background:#f8aa06}
  html body .act.sf-go:hover{background:#ffc24a}
  html body .vset .act[aria-pressed=true]{background:var(--ink);color:${SF_PAPER}}
  html body .stat .v{font-size:26px}
  html body .stat.small .v{font-size:16px}
  html body .stat .k{font-size:10px}
  html body #fig{max-width:760px}
  html body #art [fill="#41538f" i]{fill:#cdbd90}
  html body .toast{top:auto!important;bottom:11%!important}
  .sf-dot{display:inline-block;width:9px;height:9px;border-radius:50%;background:${SF_GREEN};box-shadow:0 0 0 2px ${SF_PAPER},0 0 0 3px var(--ink);vertical-align:-1px;margin-right:6px}
  html body input[type=range]{accent-color:#f8aa06;min-height:24px}
  @media (max-width:560px){html body{padding:4px 6px 8px}html body .stat .v{font-size:19px!important}}
  @media (prefers-reduced-motion:reduce){*,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}}`;
  const el = document.createElement('style');
  el.textContent = css;
  document.head.appendChild(el);
})();

/* a slider under the figure; onInput(value) returns the text shown next to the label */
function sfRange(label, min, max, step, value, onInput) {
  const host = document.querySelector('.controls');
  const d = document.createElement('div');
  d.className = 'ctl sf-range';
  d.innerHTML = `<label for="sfr">${label} <b id="sfv"></b></label><input id="sfr" type="range" min="${min}" max="${max}" step="${step}" value="${value}">`;
  host.prepend(d);
  const inp = d.querySelector('input'), out = d.querySelector('#sfv');
  const go = () => { out.textContent = onInput(+inp.value) || ''; };
  inp.addEventListener('input', go);
  go();
  return inp;
}
/* mark the main action button amber (the keycap you press first) */
function sfPrimary(label) {
  for (const b of document.querySelectorAll('.act')) if (b.textContent.trim().toLowerCase().startsWith(label.toLowerCase())) b.classList.add('sf-go');
}
/* the engine nudges the object right of centre to keep room for the buttons; the docs plates centre it so labels have room on both sides */
function sfCenter(ui, k = .06) {
  const vb = document.getElementById('fig').viewBox.baseVal;
  if (innerWidth > 560) { OX -= vb.width * k; ui.render(); }
}
/* plain integer with thin grouping, for ATP and stomach units */
const sfN = n => Math.round(n).toLocaleString('en-US');
/* smooth chase: move cur toward target by at most rate per second */
const sfChase = (cur, target, rate, dt) => (Math.abs(target - cur) <= rate * dt ? target : cur + Math.sign(target - cur) * rate * dt);
const sfLerp = (a, b, t) => a + (b - a) * t;
const sfClamp = (v, a, b) => Math.max(a, Math.min(b, v));

/* ---------- ellipsoids from latitude rings (the engine's loft wants rings of equal length) ---------- */
function sfRings(c, r, nLat = 8, nLon = 20) {
  const out = [];
  for (let i = 0; i <= nLat; i++) {
    const a = (-90 + 180 * i / nLat) * Math.PI / 180, rr = (i === 0 || i === nLat) ? .03 : Math.cos(a), z = Math.sin(a);
    out.push(Array.from({ length: nLon }, (_, j) => { const t = j / nLon * 2 * Math.PI; return [c[0] + r[0] * rr * Math.cos(t), c[1] + r[1] * rr * Math.sin(t), c[2] + r[2] * z]; }));
  }
  return out;
}
const sfPts = rings => rings.flat();
/* the faces of a ring stack that look at the viewer, three flat bands */
function sfSkin(rings, m, shade = tone) {
  let s = '';
  for (let i = 0; i < rings.length - 1; i++) s += loft(rings[i], rings[i + 1], n => shade(n, m));
  return s;
}
/* the inside of the far wall, pale: what you see through a ghosted shell */
function sfFar(rings, m) {
  let s = '';
  for (let i = 0; i < rings.length - 1; i++) s += loft(rings[i], rings[i + 1], n => mix(toneI(n.map(v => -v), m), '#f2efe7', .55), true);
  return s;
}
/* a small solid ball or ellipsoid with its own ink */
function sfBall(c, r, m, w = 1.4, shade = toneI, nLat = 6, nLon = 14) {
  const R = sfRings(c, Array.isArray(r) ? r : [r, r, r], nLat, nLon);
  return sfSkin(R, m, shade) + hullInk(sfPts(R), w);
}
/* a ring (circle) on the horizontal plane z, as a path */
const sfRing = (x, y, z, r, n = 24) => pd(on(PZ(z), ellUV(x, y, r, r, n)));
/* bounding box of a few 3D points, grown by g */
const sfBox = (pts, g = 1) => [[0, 1, 2].map(i => Math.min(...pts.map(p => p[i])) - g), [0, 1, 2].map(i => Math.max(...pts.map(p => p[i])) + g)];
/* a thin wire or tube as a sortable part: ink under, colour over */
function sfWire(pts, col, w = .6) {
  const d = pd(pts, false);
  return { box: sfBox(pts, 1), svg: `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${f(2 * w + 1)}" stroke-linejoin="round" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${f(2 * w)}" stroke-linejoin="round" stroke-linecap="round"/>` };
}
/* a four-point spark at a 3D point */
function sfSpark(x, y, z, r, col = '#f8aa06') {
  const [X, Y] = P(x, y, z), k = INK_K, a = r * k;
  const d = `M${f(X - a)} ${f(Y)}L${f(X + a)} ${f(Y)}M${f(X)} ${f(Y - a)}L${f(X)} ${f(Y + a)}M${f(X - a * .6)} ${f(Y - a * .6)}L${f(X + a * .6)} ${f(Y + a * .6)}M${f(X - a * .6)} ${f(Y + a * .6)}L${f(X + a * .6)} ${f(Y - a * .6)}`;
  return `<path d="${d}" fill="none" stroke="${INK}" stroke-width="${f(3.2 * k)}" stroke-linecap="round"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${f(1.6 * k)}" stroke-linecap="round"/>`;
}
/* a flat disc token (coin or ATP) standing flat: hexagon when n = 6 */
const sfToken = (x, y, z, r, m, n = 20, h = 1.2) => cyl(x, y, z, z + h, r, m, toneI, .9, n);
