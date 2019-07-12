

import {DataStream} from '../basic-types/DataStream';

export enum UadpDataSetMessageContentMask {
   None = 0,
  Timestamp = 1,
  PicoSeconds = 2,
  Status = 4,
  MajorVersion = 8,
  MinorVersion = 16,
  SequenceNumber = 32,

}

export function encodeUadpDataSetMessageContentMask( data: UadpDataSetMessageContentMask,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeUadpDataSetMessageContentMask( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('UadpDataSetMessageContentMask', UadpDataSetMessageContentMask, encodeUadpDataSetMessageContentMask , decodeUadpDataSetMessageContentMask , null);
