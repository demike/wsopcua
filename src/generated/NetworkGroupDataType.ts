/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {EndpointUrlListDataType} from './EndpointUrlListDataType';
import {decodeEndpointUrlListDataType} from './EndpointUrlListDataType';
import {DataStream} from '../basic-types/DataStream';

export interface INetworkGroupDataType {
  serverUri?: string;
  networkPaths?: EndpointUrlListDataType[];
}

/**

*/

export class NetworkGroupDataType {
  serverUri: string | null;
  networkPaths: EndpointUrlListDataType[];

 constructor( options?: INetworkGroupDataType) {
  options = options || {};
  this.serverUri = (options.serverUri != null) ? options.serverUri : null;
  this.networkPaths = (options.networkPaths != null) ? options.networkPaths : [];

 }


 encode( out: DataStream) {
  ec.encodeString(this.serverUri, out);
  ec.encodeArray(this.networkPaths, out);

 }


 decode( inp: DataStream) {
  this.serverUri = ec.decodeString(inp);
  this.networkPaths = ec.decodeArray(inp, decodeEndpointUrlListDataType);

 }


 toJSON() {
  const out: any = {};
  out.ServerUri = this.serverUri;
  out.NetworkPaths = this.networkPaths;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.serverUri = inp.ServerUri;
  this.networkPaths = ec.jsonDecodeStructArray( inp.NetworkPaths, EndpointUrlListDataType);

 }


 clone( target?: NetworkGroupDataType): NetworkGroupDataType {
  if (!target) {
   target = new NetworkGroupDataType();
  }
  target.serverUri = this.serverUri;
  if (this.networkPaths) { target.networkPaths = ec.cloneComplexArray(this.networkPaths); }
  return target;
 }


}
export function decodeNetworkGroupDataType( inp: DataStream): NetworkGroupDataType {
  const obj = new NetworkGroupDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('NetworkGroupDataType', NetworkGroupDataType, new ExpandedNodeId(2 /*numeric id*/, 11958, 0));
