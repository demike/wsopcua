

import {DataStream} from '../basic-types/DataStream';

export enum AccessRestrictionType {
   None = 0,
  SigningRequired = 1,
  EncryptionRequired = 2,
  SessionRequired = 4,

}

export function encodeAccessRestrictionType( data: AccessRestrictionType,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeAccessRestrictionType( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('AccessRestrictionType', AccessRestrictionType, encodeAccessRestrictionType , decodeAccessRestrictionType , null);