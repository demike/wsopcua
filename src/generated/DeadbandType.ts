/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {DataStream} from '../basic-types/DataStream';

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16179}
*/

export enum DeadbandType {
  None = 0,
  Absolute = 1,
  Percent = 2,
}

export function encodeDeadbandType( data: DeadbandType,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeDeadbandType( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('DeadbandType', DeadbandType, encodeDeadbandType , decodeDeadbandType , undefined);
