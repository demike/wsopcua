

import {ResponseHeader} from './ResponseHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IRegisterNodesResponse {
  responseHeader?: ResponseHeader;
  registeredNodeIds?: ec.NodeId[];
}

/**

*/

export class RegisterNodesResponse {
  responseHeader: ResponseHeader;
  registeredNodeIds: ec.NodeId[];

 constructor( options?: IRegisterNodesResponse) {
  options = options || {};
  this.responseHeader = (options.responseHeader !== undefined) ? options.responseHeader : new ResponseHeader();
  this.registeredNodeIds = (options.registeredNodeIds !== undefined) ? options.registeredNodeIds : [];

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);
  ec.encodeArray(this.registeredNodeIds, out, ec.encodeNodeId);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);
  this.registeredNodeIds = ec.decodeArray(inp, ec.decodeNodeId);

 }


 clone( target?: RegisterNodesResponse): RegisterNodesResponse {
  if (!target) {
   target = new RegisterNodesResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  target.registeredNodeIds = ec.cloneArray(this.registeredNodeIds);
  return target;
 }


}
export function decodeRegisterNodesResponse( inp: DataStream): RegisterNodesResponse {
  const obj = new RegisterNodesResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('RegisterNodesResponse', RegisterNodesResponse, makeExpandedNodeId(563, 0));
