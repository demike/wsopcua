

import * as ec from '../basic-types';
import {OverrideValueHandling, encodeOverrideValueHandling, decodeOverrideValueHandling} from './OverrideValueHandling';
import {Variant} from '../variant';
import {DataStream} from '../basic-types/DataStream';

export interface IFieldTargetDataType {
  dataSetFieldId?: ec.Guid;
  receiverIndexRange?: string;
  targetNodeId?: ec.NodeId;
  attributeId?: ec.UInt32;
  writeIndexRange?: string;
  overrideValueHandling?: OverrideValueHandling;
  overrideValue?: Variant;
}

/**

*/

export class FieldTargetDataType {
  dataSetFieldId: ec.Guid;
  receiverIndexRange: string;
  targetNodeId: ec.NodeId;
  attributeId: ec.UInt32;
  writeIndexRange: string;
  overrideValueHandling: OverrideValueHandling;
  overrideValue: Variant;

 constructor( options?: IFieldTargetDataType) {
  options = options || {};
  this.dataSetFieldId = (options.dataSetFieldId) ? options.dataSetFieldId : null;
  this.receiverIndexRange = (options.receiverIndexRange) ? options.receiverIndexRange : null;
  this.targetNodeId = (options.targetNodeId) ? options.targetNodeId : null;
  this.attributeId = (options.attributeId) ? options.attributeId : null;
  this.writeIndexRange = (options.writeIndexRange) ? options.writeIndexRange : null;
  this.overrideValueHandling = (options.overrideValueHandling) ? options.overrideValueHandling : null;
  this.overrideValue = (options.overrideValue) ? options.overrideValue : new Variant();

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



