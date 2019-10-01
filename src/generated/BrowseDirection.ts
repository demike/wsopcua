/** generated by wsopcua data type generator 
 do not modify, changes will be overwritten 
 */

import {DataStream} from '../basic-types/DataStream';

export enum BrowseDirection {
   Forward = 0,
  Inverse = 1,
  Both = 2,
  Invalid = 3,

}

export function encodeBrowseDirection( data: BrowseDirection,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeBrowseDirection( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('BrowseDirection', BrowseDirection, encodeBrowseDirection , decodeBrowseDirection , null);
