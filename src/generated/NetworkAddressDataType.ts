

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface INetworkAddressDataType {
  networkInterface?: string;
}

/**

*/

export class NetworkAddressDataType {
  networkInterface: string;

 constructor( options?: INetworkAddressDataType) {
  options = options || {};
  this.networkInterface = (options.networkInterface) ? options.networkInterface : null;

 }


 encode( out: DataStream) {
  ec.encodeString(this.networkInterface, out);

 }


 decode( inp: DataStream) {
  this.networkInterface = ec.decodeString(inp);

 }


 clone( target?: NetworkAddressDataType): NetworkAddressDataType {
  if (!target) {
   target = new NetworkAddressDataType();
  }
  target.networkInterface = this.networkInterface;
  return target;
 }


}
export function decodeNetworkAddressDataType( inp: DataStream): NetworkAddressDataType {
  const obj = new NetworkAddressDataType();
   obj.decode(inp);
   return obj;

 }



