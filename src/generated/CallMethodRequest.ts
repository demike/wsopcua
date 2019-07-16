

import * as ec from '../basic-types';
import {Variant} from '../variant';
import {decodeVariant} from '../variant';
import {DataStream} from '../basic-types/DataStream';

export interface ICallMethodRequest {
  objectId?: ec.NodeId;
  methodId?: ec.NodeId;
  inputArguments?: Variant[];
}

/**

*/

export class CallMethodRequest {
  objectId: ec.NodeId;
  methodId: ec.NodeId;
  inputArguments: Variant[];

 constructor( options?: ICallMethodRequest) {
  options = options || {};
  this.objectId = (options.objectId !== undefined) ? options.objectId : null;
  this.methodId = (options.methodId !== undefined) ? options.methodId : null;
  this.inputArguments = (options.inputArguments !== undefined) ? options.inputArguments : [];

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.objectId, out);
  ec.encodeNodeId(this.methodId, out);
  ec.encodeArray(this.inputArguments, out);

 }


 decode( inp: DataStream) {
  this.objectId = ec.decodeNodeId(inp);
  this.methodId = ec.decodeNodeId(inp);
  this.inputArguments = ec.decodeArray(inp, decodeVariant);

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('CallMethodRequest', CallMethodRequest, makeExpandedNodeId(706, 0));
