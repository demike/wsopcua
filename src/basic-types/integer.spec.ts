import {
  isValidInt16,
  isValidInt32,
  isValidInt8,
  isValidUInt16,
  isValidUInt32,
  isValidUInt8,
} from './integers';

describe('Integers', () => {
  it('isValidUInt16', () => {
    expect(isValidUInt16(NaN)).toEqual(false);
  });
  it('isValidInt16', () => {
    expect(isValidInt16(NaN)).toEqual(false);
  });
  it('isValidUInt32', () => {
    expect(isValidUInt32(NaN)).toEqual(false);
  });
  it('isValidInt32', () => {
    expect(isValidInt32(NaN)).toEqual(false);
  });
  it('isValidInt8', () => {
    expect(isValidInt8(NaN)).toEqual(false);
  });
  it('isValidUInt8', () => {
    expect(isValidUInt8(NaN)).toEqual(false);
  });
});
