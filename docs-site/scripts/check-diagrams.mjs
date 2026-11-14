// Usage: node scripts/check-diagrams.mjs [file.mdx ...]
// Renders every ```pele block with pele and reports syntax errors. No args = all docs.
// Every page should have at least one diagram, so pages without one are listed.
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { render } from 'pele';

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.mdx') ? [p] : [];
  });
}

const files = process.argv.length > 2 ? process.argv.slice(2) : walk('content/docs');
let blocks = 0;
let failed = 0;
for (const file of files) {
  const text = readFileSync(file, 'utf8');
  const re = /```pele\n([\s\S]*?)```/g;
  let m;
  let n = 0;
  while ((m = re.exec(text))) {
    n++;
    blocks++;
    try {
      render(m[1].trim());
    } catch (e) {
      failed++;
      console.error(`FAIL ${file} block ${n}: ${String(e.message).split('\n')[0]}`);
    }
  }
  console.log(`${n} diagram(s): ${file}`);
}
console.log(`${blocks} diagrams, ${failed} failed`);
process.exit(failed ? 1 : 0);
