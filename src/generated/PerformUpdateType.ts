

import {DataStream} from '../basic-types/DataStream';

export enum PerformUpdateType {
   Insert = 1,
  Replace = 2,
  Update = 3,
  Remove = 4,

}

export function encodePerformUpdateType( data: PerformUpdateType,  out: DataStream) {
 out.setUint32(data);
 }


export function decodePerformUpdateType( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('PerformUpdateType', PerformUpdateType, encodePerformUpdateType , decodePerformUpdateType , null);
