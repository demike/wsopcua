/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {DataStream} from '../basic-types/DataStream';

/**

 * {@link https://reference.opcfoundation.org/nodesets/2/16652}
*/

export enum AlarmMask {
  None = 0,
  Active = 1,
  Unacknowledged = 2,
  Unconfirmed = 4,
}

export function encodeAlarmMask( data: AlarmMask,  out: DataStream) {
 out.setUint16(data);
 }


export function decodeAlarmMask( inp: DataStream) {
 return inp.getUint16();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('AlarmMask', AlarmMask, encodeAlarmMask , decodeAlarmMask , undefined);
