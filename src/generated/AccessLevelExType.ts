

import {DataStream} from '../basic-types/DataStream';

export enum AccessLevelExType {
   None = 0,
  CurrentRead = 1,
  CurrentWrite = 2,
  HistoryRead = 4,
  HistoryWrite = 16,
  StatusWrite = 32,
  TimestampWrite = 64,
  NonatomicRead = 65536,
  NonatomicWrite = 131072,
  WriteFullArrayOnly = 262144,

}

export function encodeAccessLevelExType( data: AccessLevelExType,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeAccessLevelExType( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('AccessLevelExType', AccessLevelExType, encodeAccessLevelExType , decodeAccessLevelExType , null);
