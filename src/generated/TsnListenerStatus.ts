/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {DataStream} from '../basic-types/DataStream';

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15968}
*/

export enum TsnListenerStatus {
  None = 0,
  Ready = 1,
  PartialFailed = 2,
  Failed = 3,
}

export function encodeTsnListenerStatus( data: TsnListenerStatus,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeTsnListenerStatus( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('TsnListenerStatus', TsnListenerStatus, encodeTsnListenerStatus , decodeTsnListenerStatus , undefined);
