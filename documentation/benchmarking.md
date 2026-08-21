# Benchmarking & Profiling

This project ships micro-benchmarks and a CPU-profiling harness for the
performance-critical binary encode/decode pipeline (`basic-types`, `DataStream`,
`variant`, `data-value`, and generated message structures). Use them to measure
before/after any performance work so improvements are backed by numbers.

## Benchmarks (Vitest `bench`)

Benchmarks live next to the code they measure as `*.bench.ts` files and run with
a dedicated config (`vitest.bench.config.ts`) so they never run with the normal
test suite.

```bash
npm run bench          # watch mode
npm run bench:run      # single run (CI-friendly)

# run a single file
npm run bench:run -- src/basic-types/encode_decode.bench.ts
```

Current bench files:

| File | Covers |
| --- | --- |
| `src/basic-types/encode_decode.bench.ts` | UInt32, Double, String, ByteString, Guid, DateTime, NodeId |
| `src/variant/variant.bench.ts` | Scalar & array `Variant`, full `DataValue` |
| `src/service-read/read_request.bench.ts` | Full `ReadRequest` size/encode/decode round-trip (1 / 50 / 500 nodes) |
| `src/service-read/read_response.bench.ts` | Full `ReadResponse` decode: array of `DataValue`s wrapping mixed-type `Variant`s + timestamps (10 / 100 / 1000 values) — the realistic subscription/read decode payload |
| `src/chunkmanager/chunk_manager.bench.ts` | `ChunkManager` framing throughput (plain & signed, 64 KiB payload) |

Each bench pre-allocates its buffer and resets the stream position between
iterations so it measures the codec, not allocation.

### Adding a benchmark

Create a `*.bench.ts` next to the module and use the Vitest `bench` API:

```ts
import { bench, describe } from 'vitest';
import { DataStream } from '../basic-types/DataStream';

describe('my-thing', () => {
  bench('encode', () => {
    /* ... */
  });
});
```

## CPU profiling

Vitest runs benchmarks inside a `worker_thread`, and Node's `--cpu-prof` flag
only profiles the main thread — so a dedicated harness (`tools/profile.cjs`)
runs the codec loops directly in the main process to produce a reliable
`.cpuprofile`.

Because the harness runs under Node (not a browser), it loads the compiled
CommonJS build from `dist/_cjs`. Build first, then profile:

```bash
npm run profile:build   # npm run compile && npm run profile
# or, if dist/_cjs is already up to date:
npm run profile         # node --cpu-prof --cpu-prof-dir=profiles tools/profile.cjs
```

This prints a throughput summary and writes a `.cpuprofile` into the
(git-ignored) `profiles/` directory. Open it in:

- **Chrome DevTools** → Performance tab → "Load profile…", or
- **[speedscope.app](https://www.speedscope.app)** (drag & drop).

You can pass an iteration count (default `2000000`):

```bash
node --cpu-prof --cpu-prof-dir=profiles tools/profile.cjs 1000000
```

### ⚠️ Caveat: CommonJS re-export getters

The harness profiles the **CommonJS** build (`dist/_cjs`) because Node's
`--cpu-prof` needs to load the modules with `require()`. TypeScript emits every
barrel re-export (`export * from …`) as a lazy accessor via a `__createBinding`
helper — a `get: () => m[k]` indirection — so calls made through a namespace
import such as `import * as ec from '../basic-types'` (used pervasively in the
generated codecs, e.g. `ec.decodeDateTime`) go through that getter on **every
access**. In an end-to-end `ReadResponse` decode this getter shows up as ~7 % of
self time.

The **shipped browser build is ESM** (`dist/_esm`, the `module`/`es2015` entry
points), where `export *` / `import * as` are native live bindings with **no
getter indirection**. So the CJS profile *overstates* barrel-import overhead
relative to what real (browser) consumers pay. Treat that portion of the profile
as an artifact, and prefer the Vitest `bench` numbers (esbuild-compiled, no
`__createBinding`) — e.g. `read_response.bench.ts` — when judging real decode
throughput.

## Baseline snapshot

Captured with `tools/profile.cjs` (500,000 iters) on **Node v24.18.0**,
Intel Core i3-7020U @ 2.30 GHz, Linux. Numbers are **indicative** — absolute
throughput depends heavily on hardware and Node version. Run-to-run variance was
~3–5 % for the high-iteration workloads and up to ~10 % for the low-iteration
message round-trips, so treat these as an order-of-magnitude baseline, not exact
targets. Re-run on your own machine before/after a change and compare relative
deltas.

| Workload | Throughput (ops/s) |
| --- | ---: |
| `encodeUInt32` | ~5,000,000 |
| `encodeDouble` | ~4,900,000 |
| `encodeString` | ~2,000,000 |
| `encodeNodeId` (numeric) | ~3,600,000 |
| `encodeNodeId` (string) | ~1,800,000 |
| `variant encode Double[1000]` | ~1,000,000 |
| `variant decode Double[1000]` | ~115,000 |
| `ReadRequest[50] encode` | ~28,000 |
| `ReadRequest[50] round-trip` | ~14,000 |
| `ChunkManager` 64 KiB (plain / signed) | ~18,000–36,000 |

> The string/NodeId/message figures reflect the `DataStream.writeString` /
> `readString` optimisation (see below): encoding strings directly into the
> destination buffer with `TextEncoder.encodeInto` instead of allocating an
> intermediate array roughly **2–2.7× improved** the string-heavy paths.

### Hot spots (from the CPU profile)

The heaviest self-time frames in the encode/decode path were:

- `DataStream` (constructor / view setup)
- `readByteStream` / `writeByteStream`
- `nodeID_encodingByte`
- `get` (DataView accessors)
- `encodeString` / `decodeString`

These are the first places to look when optimising: `DataStream` allocation and
the byte-stream length-prefixed string/bytestring paths dominate, and string
NodeIds are ~4–5× slower than numeric ones.

### Applied optimisations

- **`DataStream.writeString` / `readString`** — encode UTF-8 directly into the
  destination buffer via `TextEncoder.encodeInto` (reserving the 4-byte length
  prefix and back-filling the real byte count) and decode from a subarray view
  instead of a defensive clone. Removes an intermediate `Uint8Array` allocation
  plus a copy per string. Result: `encodeString` ~2.7×, string `NodeId` ~2.4×,
  and `ReadRequest[50]` encode/round-trip ~2× faster, with no behavioural
  change (full unit suite still green).
- **`decodeArray` / variant general-array decode** — pre-size the result with
  `new Array(length)` and assign by index instead of `push()`, so V8 keeps a
  single packed backing store. ~1.4–1.6× faster for the array-building step
  (50–1000 elements), improving decode of structure/value arrays (browse & read
  results, monitored-item notifications). No behavioural change; full unit suite
  (861 tests) passes.
- **`DateTime` decode/encode `high_low` cache** — decoded `Date` objects are
  enriched with their original 100 ns `high_low` words so a later re-encode can
  skip the arithmetic and reproduce identical bytes. This cache was previously
  installed via `Object.defineProperty(date, 'high_low', { get })`, whose getter
  closure is very expensive to create. Replacing it with a plain (non-getter)
  property assignment — matching the approach already used in `src/date-time` —
  makes the full decode ~8× faster (~1.2M → ~9.8M ops/s) while preserving exact
  sub-millisecond byte fidelity on re-encode. DateTimes are decoded twice per
  `DataValue` (source + server timestamps), so this is a core subscription/read
  hot path. No behavioural change; full unit suite (861 tests) passes.
- **`encodeNodeId` numeric fast path** — three per-encode overheads were removed
  from the common (plain, numeric) NodeId case: (1) the automatic
  `resolveExpandedNodeId` call plus its `try/catch` is now skipped unless the id
  actually carries a `namespaceUri` and a namespace array is present (its own
  early-return already made it a no-op otherwise); (2) `nodeID_encodingByte`
  replaced the `set_flag(...)`/`check_flag` bitwise helpers — each of which runs
  an internal `assert` — with direct assignments / `|=`; and (3) the NodeId
  guard `assert(nodeId.hasOwnProperty('identifierType'))` was replaced by the
  equivalent-but-cheaper `assert(nodeId.identifierType !== undefined)` (valid
  ids have `identifierType` 0..5, so `!== undefined` still rejects non-NodeId
  objects) which avoids a method call on every encode. Result: numeric NodeId
  encode ~1.9–2.2× faster (2-byte ~16.9M → ~32.6M ops/s, 4-byte ~13.8M → ~30.4M
  ops/s). NodeIds are encoded for every request/response field, so this is a
  pervasive framing hot path. No behavioural change; full unit suite (861 tests)
  passes.
- **`decodeGuid` byte→hex lookup table** — the previous decoder assembled the
  canonical GUID string via per-field closures (`read_UInt32/16/8`,
  `read_many`), `Number.toString(16)` + `substr` padding for every field, and a
  final `toUpperCase()` over the whole string. It now reads the 16 GUID bytes as
  a single raw view (`readByteArray`) and concatenates two-char hex strings from
  a precomputed 256-entry `HEX_BYTE` table in the correct little-/big-endian
  order — no closures, no per-field number formatting, no trailing uppercase
  pass. Result: `decodeGuid` ~2.2× faster (~221K → ~490K ops/s), so it is no
  longer the slowest scalar decode. GUIDs are decoded for every GUID NodeId /
  ExpandedNodeId identifier. No behavioural change (verified byte-for-byte
  against the previous implementation over 100k random GUIDs); full unit suite
  (861 tests) passes.
- **`DataStream.readByteStream` clone via allocate + `set`** — the ByteString
  reader cloned the payload with `new Uint8Array(buffer.slice(offset, end))`.
  `ArrayBuffer.prototype.slice` is markedly slower than allocating the target
  and copying from a subarray view (measured ~6.7× on 64-byte buffers), so it
  now does `const buf = new Uint8Array(len); buf.set(new Uint8Array(view.buffer,
  view.byteOffset + pos, len))`. This also fixes a latent off-by-`byteOffset`
  bug in the old `slice` end argument (the end was computed without the view's
  `byteOffset`). Result: `decodeByteString` ~1.76× faster (~478K → ~841K ops/s);
  the same reader backs ByteString NodeId identifiers. The gain is largest for
  the common small-payload case (~7× at ≤64 B, where the fixed `slice` cost
  dominates), ~1.1–1.5× for medium payloads (256 B–64 KiB), and neutral for very
  large payloads (≥256 KiB) where the copy is memory-bandwidth bound — see the
  `ByteString[64KiB]` bench. No behavioural change; full unit suite (861 tests)
  passes.
