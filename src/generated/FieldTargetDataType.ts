/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {OverrideValueHandling, encodeOverrideValueHandling, decodeOverrideValueHandling} from './OverrideValueHandling';
import {Variant} from '../variant';
import {DataStream} from '../basic-types/DataStream';

export type IFieldTargetDataType = Partial<FieldTargetDataType>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15820}
*/

export class FieldTargetDataType {
  dataSetFieldId: ec.Guid;
  receiverIndexRange: string | null;
  targetNodeId: ec.NodeId;
  attributeId: ec.UInt32;
  writeIndexRange: string | null;
  overrideValueHandling: OverrideValueHandling;
  overrideValue: Variant;

 constructor( options?: IFieldTargetDataType | null) {
  options = options || {};
  this.dataSetFieldId = (options.dataSetFieldId != null) ? options.dataSetFieldId : "";
  this.receiverIndexRange = (options.receiverIndexRange != null) ? options.receiverIndexRange : null;
  this.targetNodeId = (options.targetNodeId != null) ? options.targetNodeId : ec.NodeId.NullNodeId;
  this.attributeId = (options.attributeId != null) ? options.attributeId : 0;
  this.writeIndexRange = (options.writeIndexRange != null) ? options.writeIndexRange : null;
  this.overrideValueHandling = (options.overrideValueHandling != null) ? options.overrideValueHandling : OverrideValueHandling.Invalid;
  this.overrideValue = (options.overrideValue != null) ? options.overrideValue : new Variant();

 }


 encode( out: DataStream) {
  ec.encodeGuid(this.dataSetFieldId, out);
  ec.encodeString(this.receiverIndexRange, out);
  ec.encodeNodeId(this.targetNodeId, out);
  ec.encodeUInt32(this.attributeId, out);
  ec.encodeString(this.writeIndexRange, out);
  encodeOverrideValueHandling(this.overrideValueHandling, out);
  this.overrideValue.encode(out);

 }


 decode( inp: DataStream) {
  this.dataSetFieldId = ec.decodeGuid(inp);
  this.receiverIndexRange = ec.decodeString(inp);
  this.targetNodeId = ec.decodeNodeId(inp);
  this.attributeId = ec.decodeUInt32(inp);
  this.writeIndexRange = ec.decodeString(inp);
  this.overrideValueHandling = decodeOverrideValueHandling(inp);
  this.overrideValue.decode(inp);

 }


 toJSON() {
  const out: any = {};
  out.DataSetFieldId = this.dataSetFieldId;
  out.ReceiverIndexRange = this.receiverIndexRange;
  out.TargetNodeId = ec.jsonEncodeNodeId(this.targetNodeId);
  out.AttributeId = this.attributeId;
  out.WriteIndexRange = this.writeIndexRange;
  out.OverrideValueHandling = this.overrideValueHandling;
  out.OverrideValue = this.overrideValue;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.dataSetFieldId = inp.DataSetFieldId;
  this.receiverIndexRange = inp.ReceiverIndexRange;
  this.targetNodeId = ec.jsonDecodeNodeId(inp.TargetNodeId);
  this.attributeId = inp.AttributeId;
  this.writeIndexRange = inp.WriteIndexRange;
  this.overrideValueHandling = inp.OverrideValueHandling;
  this.overrideValue.fromJSON(inp.OverrideValue);

 }


 clone( target?: FieldTargetDataType): FieldTargetDataType {
  if (!target) {
   target = new FieldTargetDataType();
  }
  target.dataSetFieldId = this.dataSetFieldId;
  target.receiverIndexRange = this.receiverIndexRange;
  target.targetNodeId = this.targetNodeId;
  target.attributeId = this.attributeId;
  target.writeIndexRange = this.writeIndexRange;
  target.overrideValueHandling = this.overrideValueHandling;
  if (this.overrideValue) { target.overrideValue = this.overrideValue.clone(); }
  return target;
 }


}
export function decodeFieldTargetDataType( inp: DataStream): FieldTargetDataType {
  const obj = new FieldTargetDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('FieldTargetDataType', FieldTargetDataType, new ExpandedNodeId(2 /*numeric id*/, 14848, 0));
