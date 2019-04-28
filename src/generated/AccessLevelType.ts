

import {DataStream} from '../basic-types/DataStream';

export enum AccessLevelType {
   None = 0,
  CurrentRead = 1,
  CurrentWrite = 2,
  HistoryRead = 4,
  HistoryWrite = 16,
  StatusWrite = 32,
  TimestampWrite = 64,

}

export function encodeAccessLevelType( data: AccessLevelType,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeAccessLevelType( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('AccessLevelType', AccessLevelType, encodeAccessLevelType , decodeAccessLevelType , null);
