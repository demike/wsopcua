

import {DataStream} from '../basic-types/DataStream';

export enum AccessLevelType {
   None = 0,
  CurrentRead = 1,
  CurrentWrite = 2,
  HistoryRead = 4,
  HistoryWrite = 8,
  SemanticChange = 16,
  StatusWrite = 32,
  TimestampWrite = 64,

}

export function encodeAccessLevelType( data: AccessLevelType,  out: DataStream) {
 out.setByte(data);
 }


export function decodeAccessLevelType( inp: DataStream) {
 return inp.getByte();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('AccessLevelType', AccessLevelType, encodeAccessLevelType , decodeAccessLevelType , null);
