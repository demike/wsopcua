/**
 * Audit every markdown link in a file:
 *   - #anchors        -> resolved against the GitHub heading slugs of the file
 *   - relative paths  -> checked on disk (an optional #Lnn suffix is ignored)
 *   - http(s) URLs    -> listed for a reachability pass
 *
 * Usage: node tools/check-readme-links.js README.md
 */
const fs = require('fs');
const path = require('path');

const file = process.argv[2] || 'README.md';
const src = fs.readFileSync(file, 'utf8');

// strip fenced code blocks so example code is not scanned for links
const scannable = src.replace(/```[\s\S]*?```/g, (m) => m.replace(/[^\n]/g, ' '));

/** GitHub's heading -> anchor slug rules */
function slug(heading) {
  return heading
    .trim()
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s/g, '-');
}

const headings = [];
for (const line of src.split('\n')) {
  const m = /^(#{1,6})\s+(.*?)\s*$/.exec(line);
  if (m) headings.push(m[2]);
}

// GitHub disambiguates repeated slugs with -1, -2, ...
const slugs = new Set();
const seen = new Map();
for (const h of headings) {
  const base = slug(h);
  const n = seen.get(base) || 0;
  slugs.add(n === 0 ? base : `${base}-${n}`);
  seen.set(base, n + 1);
}

const links = [];
const re = /\[([^\]]*)\]\(([^)\s]*)\)/g;
let m;
while ((m = re.exec(scannable))) {
  const line = scannable.slice(0, m.index).split('\n').length;
  links.push({ line, text: m[1], target: m[2] });
}

const broken = [];
const external = [];

for (const l of links) {
  const t = l.target;
  if (t === '') {
    broken.push({ ...l, why: 'EMPTY link target' });
  } else if (t.startsWith('#')) {
    if (!slugs.has(t.slice(1).toLowerCase())) {
      broken.push({ ...l, why: 'anchor has no matching heading' });
    }
  } else if (/^https?:\/\//i.test(t)) {
    external.push(l);
  } else if (/^[\w.-]+\.[a-z]{2,}(\/|$)/i.test(t) && !fs.existsSync(t)) {
    // looks like a bare domain with no scheme -> renders as a relative link
    broken.push({ ...l, why: 'missing https:// scheme (renders as a relative link)' });
  } else {
    const p = t.split('#')[0];
    if (!fs.existsSync(path.resolve(path.dirname(file), p))) {
      broken.push({ ...l, why: 'file does not exist' });
    }
  }
}

console.log(`${file}: ${links.length} links, ${headings.length} headings\n`);
console.log(`BROKEN (${broken.length}):`);
for (const b of broken) {
  console.log(`  line ${String(b.line).padStart(3)}  [${b.text}](${b.target})`);
  console.log(`            ^ ${b.why}`);
}
console.log(`\nEXTERNAL to probe (${external.length}):`);
for (const e of external) console.log(`  ${e.line}\t${e.target}`);
