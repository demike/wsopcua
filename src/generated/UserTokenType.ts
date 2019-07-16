

import {DataStream} from '../basic-types/DataStream';

export enum UserTokenType {
   Anonymous = 0,
  UserName = 1,
  Certificate = 2,
  IssuedToken = 3,

}

export function encodeUserTokenType( data: UserTokenType,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeUserTokenType( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('UserTokenType', UserTokenType, encodeUserTokenType , decodeUserTokenType , null);
