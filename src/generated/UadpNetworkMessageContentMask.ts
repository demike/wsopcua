

import {DataStream} from '../basic-types/DataStream';

export enum UadpNetworkMessageContentMask {
   None = 0,
  PublisherId = 1,
  GroupHeader = 2,
  WriterGroupId = 4,
  GroupVersion = 8,
  NetworkMessageNumber = 16,
  SequenceNumber = 32,
  PayloadHeader = 64,
  Timestamp = 128,
  PicoSeconds = 256,
  DataSetClassId = 512,
  PromotedFields = 1024,

}

export function encodeUadpNetworkMessageContentMask( data: UadpNetworkMessageContentMask,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeUadpNetworkMessageContentMask( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('UadpNetworkMessageContentMask', UadpNetworkMessageContentMask, encodeUadpNetworkMessageContentMask , decodeUadpNetworkMessageContentMask , null);