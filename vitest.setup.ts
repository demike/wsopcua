// Vitest setup file
import { expect, vi } from 'vitest';
import { NodeId } from './src/nodeid/nodeid';

// Helper to compare Uint8Arrays
function uint8ArraysEqual(a: Uint8Array, b: Uint8Array): boolean {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}

// Add custom equality testers
// Note: Vitest/Chai doesn't handle Uint8Array comparisons well by default
if (typeof expect.addEqualityTesters === 'function') {
  expect.addEqualityTesters([
    function (a: any, b: any) {
      // NodeId comparison
      if (a instanceof NodeId && b instanceof NodeId) {
        return NodeId.sameNodeId(a, b);
      }
      // Uint8Array comparison
      if (a instanceof Uint8Array && b instanceof Uint8Array) {
        return uint8ArraysEqual(a, b);
      }
      return undefined;
    },
  ]);
}

// Make vi globally available if needed
(globalThis as any).vi = vi;
