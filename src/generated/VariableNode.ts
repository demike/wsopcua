/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {Variant} from '../variant';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types';
import {InstanceNode} from '.';
import {IInstanceNode} from '.';

export interface IVariableNode extends IInstanceNode {
  value?: Variant;
  dataType?: ec.NodeId;
  valueRank?: ec.Int32;
  arrayDimensions?: ec.UInt32[];
  accessLevel?: ec.Byte;
  userAccessLevel?: ec.Byte;
  minimumSamplingInterval?: ec.Double;
  historizing?: boolean;
  accessLevelEx?: ec.UInt32;
}

/**

*/

export class VariableNode extends InstanceNode {
  value: Variant;
  dataType: ec.NodeId;
  valueRank: ec.Int32;
  arrayDimensions: ec.UInt32[];
  accessLevel: ec.Byte;
  userAccessLevel: ec.Byte;
  minimumSamplingInterval: ec.Double;
  historizing: boolean;
  accessLevelEx: ec.UInt32;

 constructor( options?: IVariableNode) {
  options = options || {};
  super(options);
  this.value = (options.value != null) ? options.value : new Variant();
  this.dataType = (options.dataType != null) ? options.dataType : ec.NodeId.NullNodeId;
  this.valueRank = (options.valueRank != null) ? options.valueRank : 0;
  this.arrayDimensions = (options.arrayDimensions != null) ? options.arrayDimensions : [];
  this.accessLevel = (options.accessLevel != null) ? options.accessLevel : 0;
  this.userAccessLevel = (options.userAccessLevel != null) ? options.userAccessLevel : 0;
  this.minimumSamplingInterval = (options.minimumSamplingInterval != null) ? options.minimumSamplingInterval : 0;
  this.historizing = (options.historizing != null) ? options.historizing : false;
  this.accessLevelEx = (options.accessLevelEx != null) ? options.accessLevelEx : 0;

 }


 encode( out: DataStream) {
  super.encode(out);
  this.value.encode(out);
  ec.encodeNodeId(this.dataType, out);
  ec.encodeInt32(this.valueRank, out);
  ec.encodeArray(this.arrayDimensions, out, ec.encodeUInt32);
  ec.encodeByte(this.accessLevel, out);
  ec.encodeByte(this.userAccessLevel, out);
  ec.encodeDouble(this.minimumSamplingInterval, out);
  ec.encodeBoolean(this.historizing, out);
  ec.encodeUInt32(this.accessLevelEx, out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.value.decode(inp);
  this.dataType = ec.decodeNodeId(inp);
  this.valueRank = ec.decodeInt32(inp);
  this.arrayDimensions = ec.decodeArray(inp, ec.decodeUInt32);
  this.accessLevel = ec.decodeByte(inp);
  this.userAccessLevel = ec.decodeByte(inp);
  this.minimumSamplingInterval = ec.decodeDouble(inp);
  this.historizing = ec.decodeBoolean(inp);
  this.accessLevelEx = ec.decodeUInt32(inp);

 }


 toJSON() {
  const out: any = super.toJSON();
  out.Value = this.value;
  out.DataType = ec.jsonEncodeNodeId(this.dataType);
  out.ValueRank = this.valueRank;
  out.ArrayDimensions = this.arrayDimensions;
  out.AccessLevel = this.accessLevel;
  out.UserAccessLevel = this.userAccessLevel;
  out.MinimumSamplingInterval = this.minimumSamplingInterval;
  out.Historizing = this.historizing;
  out.AccessLevelEx = this.accessLevelEx;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  super.fromJSON(inp);
  this.value.fromJSON(inp.Value);
  this.dataType = ec.jsonDecodeNodeId(inp.DataType);
  this.valueRank = inp.ValueRank;
  this.arrayDimensions = inp.ArrayDimensions;
  this.accessLevel = inp.AccessLevel;
  this.userAccessLevel = inp.UserAccessLevel;
  this.minimumSamplingInterval = inp.MinimumSamplingInterval;
  this.historizing = inp.Historizing;
  this.accessLevelEx = inp.AccessLevelEx;

 }


 clone( target?: VariableNode): VariableNode {
  if (!target) {
   target = new VariableNode();
  }
  super.clone(target);
  if (this.value) { target.value = this.value.clone(); }
  target.dataType = this.dataType;
  target.valueRank = this.valueRank;
  target.arrayDimensions = ec.cloneArray(this.arrayDimensions);
  target.accessLevel = this.accessLevel;
  target.userAccessLevel = this.userAccessLevel;
  target.minimumSamplingInterval = this.minimumSamplingInterval;
  target.historizing = this.historizing;
  target.accessLevelEx = this.accessLevelEx;
  return target;
 }


}
export function decodeVariableNode( inp: DataStream): VariableNode {
  const obj = new VariableNode();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory';
import { ExpandedNodeId } from '../nodeid';
register_class_definition('VariableNode', VariableNode, new ExpandedNodeId(2 /*numeric id*/, 269, 0));
