

import {DataStream} from '../basic-types/DataStream';

export enum JsonNetworkMessageContentMask {
   None = 0,
  NetworkMessageHeader = 1,
  DataSetMessageHeader = 2,
  SingleDataSetMessage = 4,
  PublisherId = 8,
  DataSetClassId = 16,
  ReplyTo = 32,

}

export function encodeJsonNetworkMessageContentMask( data: JsonNetworkMessageContentMask,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeJsonNetworkMessageContentMask( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('JsonNetworkMessageContentMask', JsonNetworkMessageContentMask, encodeJsonNetworkMessageContentMask , decodeJsonNetworkMessageContentMask , null);