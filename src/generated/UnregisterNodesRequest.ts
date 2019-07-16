

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IUnregisterNodesRequest {
  requestHeader?: RequestHeader;
  nodesToUnregister?: ec.NodeId[];
}

/**

*/

export class UnregisterNodesRequest {
  requestHeader: RequestHeader;
  nodesToUnregister: ec.NodeId[];

 constructor( options?: IUnregisterNodesRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader !== undefined) ? options.requestHeader : new RequestHeader();
  this.nodesToUnregister = (options.nodesToUnregister !== undefined) ? options.nodesToUnregister : [];

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeArray(this.nodesToUnregister, out, ec.encodeNodeId);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.nodesToUnregister = ec.decodeArray(inp, ec.decodeNodeId);

 }


 clone( target?: UnregisterNodesRequest): UnregisterNodesRequest {
  if (!target) {
   target = new UnregisterNodesRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  target.nodesToUnregister = ec.cloneArray(this.nodesToUnregister);
  return target;
 }


}
export function decodeUnregisterNodesRequest( inp: DataStream): UnregisterNodesRequest {
  const obj = new UnregisterNodesRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('UnregisterNodesRequest', UnregisterNodesRequest, makeExpandedNodeId(566, 0));
