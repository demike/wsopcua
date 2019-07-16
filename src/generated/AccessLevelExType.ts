

import {DataStream} from '../basic-types/DataStream';

export enum AccessLevelExType {
   None = 0,
  CurrentRead = 1,
  CurrentWrite = 2,
  HistoryRead = 4,
  HistoryWrite = 8,
  SemanticChange = 16,
  StatusWrite = 32,
  TimestampWrite = 64,
  NonatomicRead = 256,
  NonatomicWrite = 512,
  WriteFullArrayOnly = 1024,

}

export function encodeAccessLevelExType( data: AccessLevelExType,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeAccessLevelExType( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('AccessLevelExType', AccessLevelExType, encodeAccessLevelExType , decodeAccessLevelExType , null);
