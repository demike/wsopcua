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
| `encodeString` | ~770,000 |
| `encodeNodeId` (numeric) | ~3,400,000 |
| `encodeNodeId` (string) | ~730,000 |
| `variant encode Double[1000]` | ~900,000 |
| `variant decode Double[1000]` | ~100,000 |
| `ReadRequest[50] encode` | ~12,500 |
| `ReadRequest[50] round-trip` | ~5,500 |
| `ChunkManager` 64 KiB (plain / signed) | ~15,000–21,000 |

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
