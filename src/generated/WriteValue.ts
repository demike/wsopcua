/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataValue} from './DataValue';
import {DataStream} from '../basic-types/DataStream';

export interface IWriteValue {
  nodeId?: ec.NodeId;
  attributeId?: ec.UInt32;
  indexRange?: string;
  value?: DataValue;
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16158}
*/

export class WriteValue {
  nodeId: ec.NodeId;
  attributeId: ec.UInt32;
  indexRange: string | null;
  value: DataValue;

 constructor( options?: IWriteValue) {
  options = options || {};
  this.nodeId = (options.nodeId != null) ? options.nodeId : ec.NodeId.NullNodeId;
  this.attributeId = (options.attributeId != null) ? options.attributeId : 0;
  this.indexRange = (options.indexRange != null) ? options.indexRange : null;
  this.value = (options.value != null) ? options.value : new DataValue();

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.nodeId, out);
  ec.encodeUInt32(this.attributeId, out);
  ec.encodeString(this.indexRange, out);
  this.value.encode(out);

 }


 decode( inp: DataStream) {
  this.nodeId = ec.decodeNodeId(inp);
  this.attributeId = ec.decodeUInt32(inp);
  this.indexRange = ec.decodeString(inp);
  this.value.decode(inp);

 }


 toJSON() {
  const out: any = {};
  out.NodeId = ec.jsonEncodeNodeId(this.nodeId);
  out.AttributeId = this.attributeId;
  out.IndexRange = this.indexRange;
  out.Value = this.value;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.nodeId = ec.jsonDecodeNodeId(inp.NodeId);
  this.attributeId = inp.AttributeId;
  this.indexRange = inp.IndexRange;
  this.value.fromJSON(inp.Value);

 }


 clone( target?: WriteValue): WriteValue {
  if (!target) {
   target = new WriteValue();
  }
  target.nodeId = this.nodeId;
  target.attributeId = this.attributeId;
  target.indexRange = this.indexRange;
  if (this.value) { target.value = this.value.clone(); }
  return target;
 }


}
export function decodeWriteValue( inp: DataStream): WriteValue {
  const obj = new WriteValue();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('WriteValue', WriteValue, new ExpandedNodeId(2 /*numeric id*/, 668, 0));
