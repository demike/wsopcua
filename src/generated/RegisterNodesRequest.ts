/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IRegisterNodesRequest {
  requestHeader?: RequestHeader;
  nodesToRegister?: ec.NodeId[];
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16114}
*/

export class RegisterNodesRequest {
  requestHeader: RequestHeader;
  nodesToRegister: ec.NodeId[];

 constructor( options?: IRegisterNodesRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.nodesToRegister = (options.nodesToRegister != null) ? options.nodesToRegister : [];

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeArray(this.nodesToRegister, out, ec.encodeNodeId);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.nodesToRegister = ec.decodeArray(inp, ec.decodeNodeId);

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.NodesToRegister = ec.jsonEncodeArray(this.nodesToRegister, ec.jsonEncodeNodeId);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);
  this.nodesToRegister = ec.jsonDecodeArray( inp.NodesToRegister, ec.jsonDecodeNodeId);

 }


 clone( target?: RegisterNodesRequest): RegisterNodesRequest {
  if (!target) {
   target = new RegisterNodesRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  target.nodesToRegister = ec.cloneArray(this.nodesToRegister);
  return target;
 }


}
export function decodeRegisterNodesRequest( inp: DataStream): RegisterNodesRequest {
  const obj = new RegisterNodesRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('RegisterNodesRequest', RegisterNodesRequest, new ExpandedNodeId(2 /*numeric id*/, 560, 0));
