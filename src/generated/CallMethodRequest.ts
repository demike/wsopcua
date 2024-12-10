/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {Variant} from '../variant';
import {decodeVariant} from '../variant';
import {DataStream} from '../basic-types/DataStream';

export type ICallMethodRequest = Partial<CallMethodRequest>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16173}
*/

export class CallMethodRequest {
  objectId: ec.NodeId;
  methodId: ec.NodeId;
  inputArguments: (Variant)[];

 constructor( options?: ICallMethodRequest | undefined) {
  options = options || {};
  this.objectId = (options.objectId != null) ? options.objectId : ec.NodeId.NullNodeId;
  this.methodId = (options.methodId != null) ? options.methodId : ec.NodeId.NullNodeId;
  this.inputArguments = (options.inputArguments != null) ? options.inputArguments : [];

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.objectId, out);
  ec.encodeNodeId(this.methodId, out);
  ec.encodeArray(this.inputArguments, out);

 }


 decode( inp: DataStream) {
  this.objectId = ec.decodeNodeId(inp);
  this.methodId = ec.decodeNodeId(inp);
  this.inputArguments = ec.decodeArray(inp, decodeVariant) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.ObjectId = ec.jsonEncodeNodeId(this.objectId);
  out.MethodId = ec.jsonEncodeNodeId(this.methodId);
  out.InputArguments = this.inputArguments;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.objectId = ec.jsonDecodeNodeId(inp.ObjectId);
  this.methodId = ec.jsonDecodeNodeId(inp.MethodId);
  this.inputArguments = ec.jsonDecodeStructArray( inp.InputArguments,Variant);

 }


 clone( target?: CallMethodRequest): CallMethodRequest {
  if (!target) {
   target = new CallMethodRequest();
  }
  target.objectId = this.objectId;
  target.methodId = this.methodId;
  if (this.inputArguments) { target.inputArguments = ec.cloneComplexArray(this.inputArguments); }
  return target;
 }


}
export function decodeCallMethodRequest( inp: DataStream): CallMethodRequest {
  const obj = new CallMethodRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('CallMethodRequest', CallMethodRequest, new ExpandedNodeId(2 /*numeric id*/, 706, 0));
