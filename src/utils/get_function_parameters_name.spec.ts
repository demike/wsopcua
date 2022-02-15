import { getFunctionParameterNames } from '.';

describe('testing getFunctionParameterNames', function () {
  it('#getFunctionParameterNames', function () {
    expect(getFunctionParameterNames(getFunctionParameterNames)).toEqual(['func']);
    expect(getFunctionParameterNames(function (a: any, b: any, c: any, d: any) {})).toEqual([
      'a',
      'b',
      'c',
      'd',
    ]);
    expect(getFunctionParameterNames(function (a: any, /* b,c,*/ d: any) {})).toEqual(['a', 'd']);
    expect(getFunctionParameterNames(function () {})).toEqual([]);
  });
});
