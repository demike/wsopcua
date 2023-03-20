/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {LocalizedText} from './LocalizedText';
import {DataStream} from '../basic-types/DataStream';

export interface IStructureField {
  name?: string;
  description?: LocalizedText;
  dataType?: ec.NodeId;
  valueRank?: ec.Int32;
  arrayDimensions?: ec.UInt32[];
  maxStringLength?: ec.UInt32;
  isOptional?: boolean;
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15987}
*/

export class StructureField {
  name: string | null;
  description: LocalizedText;
  dataType: ec.NodeId;
  valueRank: ec.Int32;
  arrayDimensions: ec.UInt32[];
  maxStringLength: ec.UInt32;
  isOptional: boolean;

 constructor( options?: IStructureField) {
  options = options || {};
  this.name = (options.name != null) ? options.name : null;
  this.description = (options.description != null) ? options.description : new LocalizedText();
  this.dataType = (options.dataType != null) ? options.dataType : ec.NodeId.NullNodeId;
  this.valueRank = (options.valueRank != null) ? options.valueRank : 0;
  this.arrayDimensions = (options.arrayDimensions != null) ? options.arrayDimensions : [];
  this.maxStringLength = (options.maxStringLength != null) ? options.maxStringLength : 0;
  this.isOptional = (options.isOptional != null) ? options.isOptional : false;

 }


 encode( out: DataStream) {
  ec.encodeString(this.name, out);
  this.description.encode(out);
  ec.encodeNodeId(this.dataType, out);
  ec.encodeInt32(this.valueRank, out);
  ec.encodeArray(this.arrayDimensions, out, ec.encodeUInt32);
  ec.encodeUInt32(this.maxStringLength, out);
  ec.encodeBoolean(this.isOptional, out);

 }


 decode( inp: DataStream) {
  this.name = ec.decodeString(inp);
  this.description.decode(inp);
  this.dataType = ec.decodeNodeId(inp);
  this.valueRank = ec.decodeInt32(inp);
  this.arrayDimensions = ec.decodeArray(inp, ec.decodeUInt32);
  this.maxStringLength = ec.decodeUInt32(inp);
  this.isOptional = ec.decodeBoolean(inp);

 }


 toJSON() {
  const out: any = {};
  out.Name = this.name;
  out.Description = this.description;
  out.DataType = ec.jsonEncodeNodeId(this.dataType);
  out.ValueRank = this.valueRank;
  out.ArrayDimensions = this.arrayDimensions;
  out.MaxStringLength = this.maxStringLength;
  out.IsOptional = this.isOptional;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.name = inp.Name;
  this.description.fromJSON(inp.Description);
  this.dataType = ec.jsonDecodeNodeId(inp.DataType);
  this.valueRank = inp.ValueRank;
  this.arrayDimensions = inp.ArrayDimensions;
  this.maxStringLength = inp.MaxStringLength;
  this.isOptional = inp.IsOptional;

 }


 clone( target?: StructureField): StructureField {
  if (!target) {
   target = new StructureField();
  }
  target.name = this.name;
  if (this.description) { target.description = this.description.clone(); }
  target.dataType = this.dataType;
  target.valueRank = this.valueRank;
  target.arrayDimensions = ec.cloneArray(this.arrayDimensions);
  target.maxStringLength = this.maxStringLength;
  target.isOptional = this.isOptional;
  return target;
 }


}
export function decodeStructureField( inp: DataStream): StructureField {
  const obj = new StructureField();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('StructureField', StructureField, new ExpandedNodeId(2 /*numeric id*/, 101, 0));
