/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {DataStream} from '../basic-types/DataStream';

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15986}
*/

export enum StructureType {
  Structure = 0,
  StructureWithOptionalFields = 1,
  Union = 2,
  StructureWithSubtypedValues = 3,
  UnionWithSubtypedValues = 4,
}

export function encodeStructureType( data: StructureType,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeStructureType( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('StructureType', StructureType, encodeStructureType , decodeStructureType , undefined);
