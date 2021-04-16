/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {DataStream} from '../basic-types';

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



import {registerEnumeration} from '../factory';
registerEnumeration('DataSetFieldFlags', DataSetFieldFlags, encodeDataSetFieldFlags , decodeDataSetFieldFlags , undefined);
