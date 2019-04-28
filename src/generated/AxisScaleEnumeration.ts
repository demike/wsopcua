

import {DataStream} from '../basic-types/DataStream';

export enum AxisScaleEnumeration {
   Linear = 0,
  Log = 1,
  Ln = 2,

}

export function encodeAxisScaleEnumeration( data: AxisScaleEnumeration,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeAxisScaleEnumeration( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('AxisScaleEnumeration', AxisScaleEnumeration, encodeAxisScaleEnumeration , decodeAxisScaleEnumeration , null);
