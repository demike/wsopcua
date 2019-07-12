

import {DataStream} from '../basic-types/DataStream';

export enum DataSetOrderingType {
   Undefined = 0,
  AscendingWriterId = 1,
  AscendingWriterIdSingle = 2,

}

export function encodeDataSetOrderingType( data: DataSetOrderingType,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeDataSetOrderingType( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('DataSetOrderingType', DataSetOrderingType, encodeDataSetOrderingType , decodeDataSetOrderingType , null);
