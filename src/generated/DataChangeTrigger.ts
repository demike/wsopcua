/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {DataStream} from '../basic-types/DataStream';

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16178}
*/

export enum DataChangeTrigger {
  Status = 0,
  StatusValue = 1,
  StatusValueTimestamp = 2,
  Invalid = 4294967295,
}

export function encodeDataChangeTrigger( data: DataChangeTrigger,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeDataChangeTrigger( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('DataChangeTrigger', DataChangeTrigger, encodeDataChangeTrigger , decodeDataChangeTrigger , undefined);
