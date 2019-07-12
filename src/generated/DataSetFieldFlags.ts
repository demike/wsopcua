

import {DataStream} from '../basic-types/DataStream';

export enum DataSetFieldFlags {
   None = 0,
  PromotedField = 1,

}

export function encodeDataSetFieldFlags( data: DataSetFieldFlags,  out: DataStream) {
 out.setUint16(data);
 }


export function decodeDataSetFieldFlags( inp: DataStream) {
 return inp.getUint16();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('DataSetFieldFlags', DataSetFieldFlags, encodeDataSetFieldFlags , decodeDataSetFieldFlags , null);
