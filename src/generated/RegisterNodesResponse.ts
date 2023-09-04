/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {ResponseHeader} from './ResponseHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IRegisterNodesResponse {
  responseHeader?: ResponseHeader;
  registeredNodeIds?: ec.NodeId[];
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16115}
*/

export class RegisterNodesResponse {
  responseHeader: ResponseHeader;
  registeredNodeIds: ec.NodeId[];

 constructor( options?: IRegisterNodesResponse) {
  options = options || {};
  this.responseHeader = (options.responseHeader != null) ? options.responseHeader : new ResponseHeader();
  this.registeredNodeIds = (options.registeredNodeIds != null) ? options.registeredNodeIds : [];

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);
  ec.encodeArray(this.registeredNodeIds, out, ec.encodeNodeId);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);
  this.registeredNodeIds = ec.decodeArray(inp, ec.decodeNodeId) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.ResponseHeader = this.responseHeader;
  out.RegisteredNodeIds = ec.jsonEncodeArray(this.registeredNodeIds, ec.jsonEncodeNodeId);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.responseHeader.fromJSON(inp.ResponseHeader);
  this.registeredNodeIds = ec.jsonDecodeArray( inp.RegisteredNodeIds, ec.jsonDecodeNodeId);

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
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('RegisterNodesResponse', RegisterNodesResponse, new ExpandedNodeId(2 /*numeric id*/, 563, 0));
