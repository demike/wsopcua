

import {DataStream} from '../basic-types/DataStream';

export enum OverrideValueHandling {
   Disabled = 0,
  LastUsableValue = 1,
  OverrideValue = 2,

}

export function encodeOverrideValueHandling( data: OverrideValueHandling,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeOverrideValueHandling( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('OverrideValueHandling', OverrideValueHandling, encodeOverrideValueHandling , decodeOverrideValueHandling , null);
