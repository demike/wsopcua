

import {DataStream} from '../basic-types/DataStream';

export enum IdType {
   Numeric = 0,
  String = 1,
  Guid = 2,
  Opaque = 3,

}

export function encodeIdType( data: IdType,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeIdType( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('IdType', IdType, encodeIdType , decodeIdType , null);
