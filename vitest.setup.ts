// Vitest setup file
import { expect, vi } from 'vitest';
import { NodeId } from './src/nodeid/nodeid';

function bytesToBase64(bytes: Uint8Array) {
  const chunkSize = 0x8000;
  let binary = '';
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

function bytesToHex(bytes: Uint8Array) {
  let hex = '';
  for (let index = 0; index < bytes.length; index++) {
    hex += bytes[index].toString(16).padStart(2, '0');
  }
  return hex;
}

function base64ToBytes(base64: string, options?: Parameters<typeof Uint8Array.fromBase64>[1]) {
  let normalized = base64;
  if (options?.alphabet === 'base64url') {
    normalized = normalized.replace(/-/g, '+').replace(/_/g, '/');
  }
  const remainder = normalized.length % 4;
  if (remainder) {
    normalized = normalized.padEnd(normalized.length + 4 - remainder, '=');
  }
  const binary = atob(normalized);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

function hexToBytes(hex: string) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < hex.length; index += 2) {
    bytes[index / 2] = parseInt(hex.substring(index, index + 2), 16);
  }
  return bytes;
}

if (typeof Uint8Array.prototype.toBase64 !== 'function') {
  Object.defineProperty(Uint8Array.prototype, 'toBase64', {
    configurable: true,
    writable: true,
    value: function (this: Uint8Array, options?: Parameters<Uint8Array['toBase64']>[0]) {
      let encoded = bytesToBase64(this);
      if (options?.alphabet === 'base64url') {
        encoded = encoded.replace(/\+/g, '-').replace(/\//g, '_');
      }
      if (options?.omitPadding) {
        encoded = encoded.replace(/=+$/g, '');
      }
      return encoded;
    },
  });
}

if (typeof Uint8Array.prototype.toHex !== 'function') {
  Object.defineProperty(Uint8Array.prototype, 'toHex', {
    configurable: true,
    writable: true,
    value: function (this: Uint8Array) {
      return bytesToHex(this);
    },
  });
}

if (typeof Uint8Array.fromBase64 !== 'function') {
  Object.defineProperty(Uint8Array, 'fromBase64', {
    configurable: true,
    writable: true,
    value: function (base64: string, options?: Parameters<typeof Uint8Array.fromBase64>[1]) {
      return base64ToBytes(base64, options);
    },
  });
}

if (typeof Uint8Array.fromHex !== 'function') {
  Object.defineProperty(Uint8Array, 'fromHex', {
    configurable: true,
    writable: true,
    value: function (hex: string) {
      return hexToBytes(hex);
    },
  });
}

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
