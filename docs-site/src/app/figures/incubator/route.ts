import { readFileSync } from 'node:fs';
import { join } from 'node:path';

// The incubator figure is the landing page's isometric drawing, copied unchanged to figures-src/.
// It is styled by --anatomy-* CSS variables that only exist on the landing page, so as an <img> it
// would lose its colours. This route resolves every variable to the landing page's plain-marigold
// light palette once, at build time, and serves the result as a static, immutable SVG.
export const dynamic = 'force-static';

const PALETTE: Record<string, string> = {
  paper: '#fbfaf5',
  face: '#fef8ed',
  top: '#fffdf8',
  'shade-0': '#c3a972',
  'shade-1': '#d8c399',
  'shade-2': '#ecdcb8',
  'shade-3': '#fef8ed',
  'lit-top': '#ffd57a',
  'lit-shade': '#f8aa06',
  hi: '#161412',
  mid: '#5e5340',
  lo: '#9d8e6c',
  faint: '#d6c8a6',
  lit: '#161412',
  halo: '#2a2218',
  'halo-opacity': '0',
  dot: '#161412',
  red: '#d94135',
  green: '#4a8b3a',
  blue: '#3e6fb0',
  weight: '0.95px',
  mono: '"JetBrains Mono", ui-monospace, "SF Mono", Menlo, Consolas, monospace',
};

export function GET() {
  const source = readFileSync(join(process.cwd(), 'figures-src', 'incubator.svg'), 'utf8');
  const svg = source.replace(/var\(--anatomy-([a-z0-9-]+)\)/g, (_m, name: string) => {
    const value = PALETTE[name];
    if (value === undefined) throw new Error(`incubator figure: no value for --anatomy-${name}`);
    return value;
  });
  return new Response(svg, {
    headers: {
      'content-type': 'image/svg+xml; charset=utf-8',
      'cache-control': 'public, max-age=31536000, immutable',
    },
  });
}
