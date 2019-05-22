

import {DataStream} from '../basic-types/DataStream';

export enum TimestampsToReturn {
   Source = 0,
  Server = 1,
  Both = 2,
  Neither = 3,
  Invalid = 4,

}

export function encodeTimestampsToReturn( data: TimestampsToReturn,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeTimestampsToReturn( inp: DataStream) {
    const tstr = inp.getUint32();
    return (tstr < 4) ? tstr : TimestampsToReturn.Invalid;

 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('TimestampsToReturn', TimestampsToReturn, encodeTimestampsToReturn , decodeTimestampsToReturn , null);
