

import {DataStream} from '../basic-types/DataStream';

export enum JsonDataSetMessageContentMask {
   None = 0,
  DataSetWriterId = 1,
  MetaDataVersion = 2,
  SequenceNumber = 4,
  Timestamp = 8,
  Status = 16,

}

export function encodeJsonDataSetMessageContentMask( data: JsonDataSetMessageContentMask,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeJsonDataSetMessageContentMask( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('JsonDataSetMessageContentMask', JsonDataSetMessageContentMask, encodeJsonDataSetMessageContentMask , decodeJsonDataSetMessageContentMask , null);
