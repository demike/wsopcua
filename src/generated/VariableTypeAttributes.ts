/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {Variant} from '../variant';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {NodeAttributes} from './NodeAttributes';
import {INodeAttributes} from './NodeAttributes';

export type IVariableTypeAttributes = Partial<VariableTypeAttributes>;

/**

*/

export class VariableTypeAttributes extends NodeAttributes {
  value: Variant;
  dataType: ec.NodeId;
  valueRank: ec.Int32;
  arrayDimensions: (ec.UInt32)[];
  isAbstract: boolean;

 constructor( options?: IVariableTypeAttributes | null) {
  options = options || {};
  super(options);
  this.value = (options.value != null) ? options.value : new Variant();
  this.dataType = (options.dataType != null) ? options.dataType : ec.NodeId.NullNodeId;
  this.valueRank = (options.valueRank != null) ? options.valueRank : 0;
  this.arrayDimensions = (options.arrayDimensions != null) ? options.arrayDimensions : [];
  this.isAbstract = (options.isAbstract != null) ? options.isAbstract : false;

 }


 encode( out: DataStream) {
  super.encode(out);
  this.value.encode(out);
  ec.encodeNodeId(this.dataType, out);
  ec.encodeInt32(this.valueRank, out);
  ec.encodeArray(this.arrayDimensions, out, ec.encodeUInt32);
  ec.encodeBoolean(this.isAbstract, out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.value.decode(inp);
  this.dataType = ec.decodeNodeId(inp);
  this.valueRank = ec.decodeInt32(inp);
  this.arrayDimensions = ec.decodeArray(inp, ec.decodeUInt32) ?? [];
  this.isAbstract = ec.decodeBoolean(inp);

 }


 toJSON() {
  const out: any = super.toJSON();
  out.Value = this.value;
  out.DataType = ec.jsonEncodeNodeId(this.dataType);
  out.ValueRank = this.valueRank;
  out.ArrayDimensions = this.arrayDimensions;
  out.IsAbstract = this.isAbstract;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  super.fromJSON(inp);
  this.value.fromJSON(inp.Value);
  this.dataType = ec.jsonDecodeNodeId(inp.DataType);
  this.valueRank = inp.ValueRank;
  this.arrayDimensions = inp.ArrayDimensions;
  this.isAbstract = inp.IsAbstract;

 }


 clone( target?: VariableTypeAttributes): VariableTypeAttributes {
  if (!target) {
   target = new VariableTypeAttributes();
  }
  super.clone(target);
  if (this.value) { target.value = this.value.clone(); }
  target.dataType = this.dataType;
  target.valueRank = this.valueRank;
  target.arrayDimensions = ec.cloneArray(this.arrayDimensions);
  target.isAbstract = this.isAbstract;
  return target;
 }


}
export function decodeVariableTypeAttributes( inp: DataStream): VariableTypeAttributes {
  const obj = new VariableTypeAttributes();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('VariableTypeAttributes', VariableTypeAttributes, new ExpandedNodeId(2 /*numeric id*/, 366, 0));
