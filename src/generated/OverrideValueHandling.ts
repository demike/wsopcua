/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {DataStream} from '../basic-types/DataStream';

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15821}
*/

export enum OverrideValueHandling {
  Disabled = 0,
  LastUsableValue = 1,
  OverrideValue = 2,
  Invalid = 4294967295,
}

export function encodeOverrideValueHandling( data: OverrideValueHandling,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeOverrideValueHandling( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('OverrideValueHandling', OverrideValueHandling, encodeOverrideValueHandling , decodeOverrideValueHandling , undefined);
