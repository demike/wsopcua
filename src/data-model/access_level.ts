'use strict';

// TODO: remove this again, the generated classes should be used (note that the schema for the generated class ist wrong -> FIX IT!!!)

/**
 * @module opcua.datamodel
 */

import { registerBasicType } from '../factory/factories_basic_type';
import * as utils from '../utils';
import { DataStream } from '../basic-types/DataStream';
import { Variant } from '../variant';

export enum AccessLevelFlag {
  CurrentRead = 0x01, // bit 0 : Indicate if the current value is readable (0 means not readable, 1 means readable).
  CurrentWrite = 0x02, // bit 1 : Indicate if the current value is writable (0 means not writable, 1 means writable).
  HistoryRead = 0x04, // bit 2 : Indicates if the history of the value is readable (0 means not readable, 1 means readable).
  HistoryWrite = 0x08, // bit 3 : Indicates if the history of the value is writable (0 means not writable, 1 means writable).
  SemanticChange = 0x10, // bit 4 : Indicates if the Variable used as Property generates SemanticChangeEvents
  StatusWrite = 0x20, // bit 5 : Indicates if the current StatusCode of the value is writable (0 means not writable, 1 means writable).
  TimestampWrite = 0x40, // bit 6 : Indicates if the current SourceTimestamp of the
  // value is writable (0 means not writable, 1 means writable).
  NONE = 0x800,
}

// @example
//      makeAccessLevel("CurrentRead | CurrentWrite").should.eql(0x03);
export function makeAccessLevel(str: string): AccessLevelFlag {
  if (typeof str === 'number') {
    const value = str as number;
    if (value === 0) {
      return AccessLevelFlag.NONE;
    }
    return value as AccessLevelFlag;
  }

  let accessFlag: AccessLevelFlag;
  if (str === '' || str === null) {
    accessFlag = AccessLevelFlag.NONE;
  } else {
    //    accessFlag = AccessLevelFlag[str as keyof typeof AccessLevelFlag];
    const flags = str.split(' | ');
    accessFlag = 0;
    for (const flag of flags) {
      // tslint:disable-next-line: no-bitwise
      accessFlag |= (AccessLevelFlag as any)[flag];
    }
  }

  if (utils.isNullOrUndefined(accessFlag)) {
    throw new Error(
      "Invalid access flag specified '" + str + "' should be one of " + AccessLevelFlag
    );
  }
  return accessFlag;
}

registerBasicType({
  name: 'AccessLevelFlag',
  subtype: 'Byte',
  defaultValue: function () {
    // tslint:disable-next-line: no-bitwise
    return AccessLevelFlag.CurrentRead | AccessLevelFlag.CurrentWrite;
  },
  encode: function (value: Variant, stream: DataStream) {
    // tslint:disable-next-line:no-bitwise
    stream.setUint8(value.value & 0x8f);
  },
  decode: function (stream: DataStream) {
    const code = stream.getUint8();
    return code ? code : AccessLevelFlag.NONE;
  },
  coerce: function (value: string) {
    return makeAccessLevel(value);
  },
  random: function () {
    return this.defaultValue();
  },
});
