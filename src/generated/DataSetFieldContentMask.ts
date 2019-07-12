

import {DataStream} from '../basic-types/DataStream';

export enum DataSetFieldContentMask {
   None = 0,
  StatusCode = 1,
  SourceTimestamp = 2,
  ServerTimestamp = 4,
  SourcePicoSeconds = 8,
  ServerPicoSeconds = 16,
  RawData = 32,

}

export function encodeDataSetFieldContentMask( data: DataSetFieldContentMask,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeDataSetFieldContentMask( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('DataSetFieldContentMask', DataSetFieldContentMask, encodeDataSetFieldContentMask , decodeDataSetFieldContentMask , null);
