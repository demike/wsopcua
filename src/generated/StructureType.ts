/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {DataStream} from '../basic-types/DataStream';

export enum StructureType {
  Structure = 0,
  StructureWithOptionalFields = 1,
  Union = 2,
}

export function encodeStructureType( data: StructureType,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeStructureType( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('StructureType', StructureType, encodeStructureType , decodeStructureType , null);
