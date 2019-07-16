

import {DataStream} from '../basic-types/DataStream';

export enum MessageSecurityMode {
   Invalid = 0,
  None = 1,
  Sign = 2,
  SignAndEncrypt = 3,

}

export function encodeMessageSecurityMode( data: MessageSecurityMode,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeMessageSecurityMode( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('MessageSecurityMode', MessageSecurityMode, encodeMessageSecurityMode , decodeMessageSecurityMode , null);
