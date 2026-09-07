/**
 * One-shot codemod: convert jasmine's two-argument matcher form
 *
 *   expect(actual).toBe(expected, 'message')
 *   expect(actual).toBeTruthy('message')
 *
 * to the vitest form, which carries the message on expect() itself:
 *
 *   expect(actual, 'message').toBe(expected)
 *   expect(actual, 'message').toBeTruthy()
 *
 * Only a trailing argument that *starts* with a string literal is moved, so
 * genuine matcher arguments are left alone. Run with:
 *
 *   node tools/codemod-jasmine-expect.js <file>...
 */
const fs = require('fs');

const QUOTES = new Set(["'", '"', '`']);

// A trailing string is only a jasmine message if the matcher is already
// saturated without it. Anything not listed here - notably the variadic
// toHaveBeenCalledWith family, where a trailing string is a real expected
// argument - is left alone.
const ARITY = {
  toBeTruthy: 0,
  toBeFalsy: 0,
  toBeNull: 0,
  toBeUndefined: 0,
  toBeDefined: 0,
  toBeNaN: 0,
  toHaveBeenCalled: 0,
  toBe: 1,
  toEqual: 1,
  toStrictEqual: 1,
  toContain: 1,
  toContainEqual: 1,
  toMatch: 1,
  toBeGreaterThan: 1,
  toBeGreaterThanOrEqual: 1,
  toBeLessThan: 1,
  toBeLessThanOrEqual: 1,
  toHaveLength: 1,
  toBeInstanceOf: 1,
  toHaveBeenCalledTimes: 1,
};

/** index just past the string literal starting at `i` */
function skipString(src, i) {
  const quote = src[i++];
  while (i < src.length) {
    if (src[i] === '\\') {
      i += 2;
      continue;
    }
    if (src[i] === quote) {
      return i + 1;
    }
    i++;
  }
  return i;
}

/** index of the closing bracket matching the opener at `i` */
function matchBracket(src, i) {
  const pairs = { '(': ')', '[': ']', '{': '}' };
  const stack = [pairs[src[i]]];
  i++;
  while (i < src.length && stack.length) {
    const c = src[i];
    if (QUOTES.has(c)) {
      i = skipString(src, i);
      continue;
    }
    if (c === '(' || c === '[' || c === '{') {
      stack.push(pairs[c]);
      i++;
      continue;
    }
    if (c === stack[stack.length - 1]) {
      stack.pop();
      i++;
      continue;
    }
    i++;
  }
  return i - 1; // position of the matching closer
}

/** split an argument list on top-level commas */
function splitArgs(src) {
  const args = [];
  let depth = 0;
  let start = 0;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (QUOTES.has(c)) {
      i = skipString(src, i) - 1;
      continue;
    }
    if (c === '(' || c === '[' || c === '{') {
      depth++;
    } else if (c === ')' || c === ']' || c === '}') {
      depth--;
    } else if (c === ',' && depth === 0) {
      args.push(src.slice(start, i));
      start = i + 1;
    }
  }
  if (src.slice(start).trim()) {
    args.push(src.slice(start));
  }
  return args;
}

function transform(src) {
  let out = '';
  let i = 0;
  let count = 0;

  while (i < src.length) {
    // only a bare `expect(` call, never expect.fail / expect.any / ...
    if (!(src.startsWith('expect(', i) && !/[\w$.]/.test(src[i - 1] || ''))) {
      out += src[i++];
      continue;
    }

    const openExpect = i + 'expect'.length;
    const closeExpect = matchBracket(src, openExpect);
    const actual = src.slice(openExpect + 1, closeExpect);

    // walk the matcher chain: .not.toBe( , .resolves.toEqual( , .toBe(
    const chain = [];
    let j = closeExpect + 1;
    let callOpen = -1;
    for (;;) {
      const m = /^\s*\.\s*([A-Za-z_$][\w$]*)/.exec(src.slice(j));
      if (!m) break;
      chain.push(m[1]);
      j += m[0].length;
      const after = /^\s*\(/.exec(src.slice(j));
      if (after) {
        callOpen = j + after[0].length - 1;
        break;
      }
    }

    if (callOpen === -1) {
      out += src.slice(i, closeExpect + 1);
      i = closeExpect + 1;
      continue;
    }

    const callClose = matchBracket(src, callOpen);
    const args = splitArgs(src.slice(callOpen + 1, callClose));
    const last = args.length ? args[args.length - 1].trim() : '';

    const arity = ARITY[chain[chain.length - 1]];
    const isMessage =
      args.length > 0 && QUOTES.has(last[0]) && arity !== undefined && args.length === arity + 1;

    if (!isMessage) {
      // not a jasmine message: leave this call untouched
      out += src.slice(i, callClose + 1);
      i = callClose + 1;
      continue;
    }

    const kept = args.slice(0, -1).map((a) => a.trim());
    out += `expect(${actual.trim()}, ${last}).${chain.join('.')}(${kept.join(', ')})`;
    i = callClose + 1;
    count++;
  }

  return { out, count };
}

let total = 0;
for (const file of process.argv.slice(2)) {
  const src = fs.readFileSync(file, 'utf8');
  const { out, count } = transform(src);
  if (count) {
    fs.writeFileSync(file, out);
    console.log(`${count}\t${file}`);
    total += count;
  }
}
console.log(`total: ${total}`);
