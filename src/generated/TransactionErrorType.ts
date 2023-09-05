/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {LocalizedText} from './LocalizedText';
import {DataStream} from '../basic-types/DataStream';

export type ITransactionErrorType = Partial<TransactionErrorType>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/2/16703}
*/

export class TransactionErrorType {
  targetId: ec.NodeId;
  error: ec.StatusCode | null;
  message: LocalizedText;

 constructor( options?: ITransactionErrorType) {
  options = options || {};
  this.targetId = (options.targetId != null) ? options.targetId : ec.NodeId.NullNodeId;
  this.error = (options.error != null) ? options.error : null;
  this.message = (options.message != null) ? options.message : new LocalizedText();

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.targetId, out);
  ec.encodeStatusCode(this.error, out);
  this.message.encode(out);

 }


 decode( inp: DataStream) {
  this.targetId = ec.decodeNodeId(inp);
  this.error = ec.decodeStatusCode(inp);
  this.message.decode(inp);

 }


 toJSON() {
  const out: any = {};
  out.TargetId = ec.jsonEncodeNodeId(this.targetId);
  out.Error = ec.jsonEncodeStatusCode(this.error);
  out.Message = this.message;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.targetId = ec.jsonDecodeNodeId(inp.TargetId);
  this.error = ec.jsonDecodeStatusCode(inp.Error);
  this.message.fromJSON(inp.Message);

 }


 clone( target?: TransactionErrorType): TransactionErrorType {
  if (!target) {
   target = new TransactionErrorType();
  }
  target.targetId = this.targetId;
  target.error = this.error;
  if (this.message) { target.message = this.message.clone(); }
  return target;
 }


}
export function decodeTransactionErrorType( inp: DataStream): TransactionErrorType {
  const obj = new TransactionErrorType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('TransactionErrorType', TransactionErrorType, new ExpandedNodeId(2 /*numeric id*/, 32382, 0));
