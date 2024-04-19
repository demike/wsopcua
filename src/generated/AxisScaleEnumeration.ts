/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {DataStream} from '../basic-types/DataStream';

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16246}
*/

export enum AxisScaleEnumeration {
  Linear = 0,
  Log = 1,
  Ln = 2,
  Invalid = 4294967295,
}

export function encodeAxisScaleEnumeration( data: AxisScaleEnumeration,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeAxisScaleEnumeration( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('AxisScaleEnumeration', AxisScaleEnumeration, encodeAxisScaleEnumeration , decodeAxisScaleEnumeration , undefined);
