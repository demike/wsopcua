/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface INetworkAddressDataType {
  networkInterface?: string;
}

/**

*/

export class NetworkAddressDataType {
  networkInterface: string | null;

 constructor( options?: INetworkAddressDataType) {
  options = options || {};
  this.networkInterface = (options.networkInterface != null) ? options.networkInterface : null;

 }


 encode( out: DataStream) {
  ec.encodeString(this.networkInterface, out);

 }


 decode( inp: DataStream) {
  this.networkInterface = ec.decodeString(inp);

 }


 toJSON() {
  const out: any = {};
  out.NetworkInterface = this.networkInterface;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.networkInterface = inp.NetworkInterface;

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



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('NetworkAddressDataType', NetworkAddressDataType, new ExpandedNodeId(2 /*numeric id*/, 21151, 0));
