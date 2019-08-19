

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {NetworkAddressDataType} from './NetworkAddressDataType';
import {INetworkAddressDataType} from './NetworkAddressDataType';

export interface INetworkAddressUrlDataType extends INetworkAddressDataType {
  url?: string;
}

/**

*/

export class NetworkAddressUrlDataType extends NetworkAddressDataType {
  url: string;

 constructor( options?: INetworkAddressUrlDataType) {
  options = options || {};
  super(options);
  this.url = (options.url !== undefined) ? options.url : null;

 }


 encode( out: DataStream) {
  super.encode(out);
  ec.encodeString(this.url, out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.url = ec.decodeString(inp);

 }


 clone( target?: NetworkAddressUrlDataType): NetworkAddressUrlDataType {
  if (!target) {
   target = new NetworkAddressUrlDataType();
  }
  super.clone(target);
  target.url = this.url;
  return target;
 }


}
export function decodeNetworkAddressUrlDataType( inp: DataStream): NetworkAddressUrlDataType {
  const obj = new NetworkAddressUrlDataType();
   obj.decode(inp);
   return obj;

 }


