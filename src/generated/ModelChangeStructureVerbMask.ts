

import {DataStream} from '../basic-types/DataStream';

export enum ModelChangeStructureVerbMask {
   NodeAdded = 1,
  NodeDeleted = 2,
  ReferenceAdded = 4,
  ReferenceDeleted = 8,
  DataTypeChanged = 16,

}

export function encodeModelChangeStructureVerbMask( data: ModelChangeStructureVerbMask,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeModelChangeStructureVerbMask( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('ModelChangeStructureVerbMask', ModelChangeStructureVerbMask, encodeModelChangeStructureVerbMask , decodeModelChangeStructureVerbMask , null);
