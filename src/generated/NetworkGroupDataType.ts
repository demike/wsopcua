

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
  serverUri: string;
  networkPaths: EndpointUrlListDataType[];

 constructor( options?: INetworkGroupDataType) {
  options = options || {};
  this.serverUri = (options.serverUri !== undefined) ? options.serverUri : null;
  this.networkPaths = (options.networkPaths !== undefined) ? options.networkPaths : [];

 }


 encode( out: DataStream) {
  ec.encodeString(this.serverUri, out);
  ec.encodeArray(this.networkPaths, out);

 }


 decode( inp: DataStream) {
  this.serverUri = ec.decodeString(inp);
  this.networkPaths = ec.decodeArray(inp, decodeEndpointUrlListDataType);

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('NetworkGroupDataType', NetworkGroupDataType, makeExpandedNodeId(11958, 0));
