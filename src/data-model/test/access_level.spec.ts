import { makeAccessLevel, AccessLevelFlag } from '../access_level';
import { findBuiltInType } from '../../factory/factories_builtin_types';

describe('Testing AccessLevelFlag', function () {
  it('should create a access level flags from a string', function () {
    expect(makeAccessLevel('CurrentRead')).toBe(0x01);
    expect(makeAccessLevel('CurrentWrite')).toBe(0x02);
    expect(makeAccessLevel('CurrentRead | CurrentWrite')).toBe(0x03);
    expect(makeAccessLevel('CurrentWrite | CurrentRead')).toBe(0x03);

    expect(AccessLevelFlag[0x1]).toBe('CurrentRead');
    expect(AccessLevelFlag[0x2]).toBe('CurrentWrite');
    // todo        AccessLevelFlag[0x3].should.eql("CurrentRead | CurrentWrite");
  });

  it('should create a flag with no bit set', function () {
    const accessLevel = makeAccessLevel('');
    expect(accessLevel).toBe(AccessLevelFlag.NONE);
    expect(accessLevel & AccessLevelFlag.CurrentRead).toBe(0);
    expect(accessLevel & AccessLevelFlag.CurrentWrite).toBe(0);
  });
  /*
    it('should create a flag with no bit set -> 0', function () {
        const accessLevel = makeAccessLevel(0);
        expect(accessLevel).toBe(AccessLevelFlag.NONE);
        expect(accessLevel & AccessLevelFlag.CurrentRead).toBe(0);
        expect(accessLevel & AccessLevelFlag.CurrentWrite).toBe(0);

    });
    */
  it('should have a accessLevel Flag Basic Type', function () {
    expect(findBuiltInType('AccessLevelFlag')).toBeDefined();
  });

  it('should provide a easy way to check if a flag is set or not', function () {
    const accessLevel = makeAccessLevel('CurrentWrite | CurrentRead');
    expect(accessLevel & AccessLevelFlag.CurrentWrite).toBe(AccessLevelFlag.CurrentWrite);
    expect(accessLevel & AccessLevelFlag.CurrentRead).toBe(AccessLevelFlag.CurrentRead);
    expect(accessLevel & AccessLevelFlag.HistoryRead).toBe(0);
  });
});
