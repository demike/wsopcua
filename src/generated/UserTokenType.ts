/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {DataStream} from '../basic-types/DataStream';

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16034}
*/

export enum UserTokenType {
  Anonymous = 0,
  UserName = 1,
  Certificate = 2,
  IssuedToken = 3,
  Invalid = 4294967295,
}

export function encodeUserTokenType( data: UserTokenType,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeUserTokenType( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('UserTokenType', UserTokenType, encodeUserTokenType , decodeUserTokenType , undefined);
