/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {DataStream} from '../basic-types/DataStream';

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15967}
*/

export enum TsnTalkerStatus {
  None = 0,
  Ready = 1,
  Failed = 2,
}

export function encodeTsnTalkerStatus( data: TsnTalkerStatus,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeTsnTalkerStatus( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('TsnTalkerStatus', TsnTalkerStatus, encodeTsnTalkerStatus , decodeTsnTalkerStatus , undefined);