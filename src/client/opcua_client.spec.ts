import { serverHasCertificate } from './opcua_client';

describe('serverHasCertificate', () => {
  it('should return false when no certificate is provided', () => {
    expect(serverHasCertificate(undefined)).toBe(false);
    expect(serverHasCertificate(null)).toBe(false);
  });

  it('should return false for an empty certificate buffer', () => {
    // an empty Uint8Array is truthy in JS: this is the regression this guard protects against.
    // Without the length check the client would try to encrypt credentials against a
    // zero-length certificate instead of falling back to an unencrypted password.
    expect(serverHasCertificate(new Uint8Array(0))).toBe(false);
  });

  it('should return true for a non-empty certificate buffer', () => {
    expect(serverHasCertificate(new Uint8Array([0x30, 0x82, 0x01]))).toBe(true);
  });
});
