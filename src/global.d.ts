export {};
declare global {
  interface Window {
    setImmediate(callback: (...args: any[]) => void, ...args: any[]): any;
  }

  /**
   * jasmine-era global kept alive by the vitest setup files
   * (see vitest.setup.ts / vitest.e2e.setup.ts), which shim it onto globalThis.
   * Declared here so the specs that still use it type-check.
   */
  function fail(message?: unknown): never;
}
