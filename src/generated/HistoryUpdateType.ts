/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {DataStream} from '../basic-types/DataStream';

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16162}
*/

export enum HistoryUpdateType {
  Insert = 1,
  Replace = 2,
  Update = 3,
  Delete = 4,
  Invalid = 4294967295,
}

export function encodeHistoryUpdateType( data: HistoryUpdateType,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeHistoryUpdateType( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('HistoryUpdateType', HistoryUpdateType, encodeHistoryUpdateType , decodeHistoryUpdateType , undefined);
