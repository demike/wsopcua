/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {LocalizedText} from './LocalizedText';
import {DataSetFieldFlags, encodeDataSetFieldFlags, decodeDataSetFieldFlags} from './DataSetFieldFlags';
import {KeyValuePair} from './KeyValuePair';
import {decodeKeyValuePair} from './KeyValuePair';
import {DataStream} from '../basic-types/DataStream';

export interface IFieldMetaData {
  name?: string;
  description?: LocalizedText;
  fieldFlags?: DataSetFieldFlags;
  builtInType?: ec.Byte;
  dataType?: ec.NodeId;
  valueRank?: ec.Int32;
  arrayDimensions?: ec.UInt32[];
  maxStringLength?: ec.UInt32;
  dataSetFieldId?: ec.Guid;
  properties?: KeyValuePair[];
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15792}
*/

export class FieldMetaData {
  name: string | null;
  description: LocalizedText;
  fieldFlags: DataSetFieldFlags;
  builtInType: ec.Byte;
  dataType: ec.NodeId;
  valueRank: ec.Int32;
  arrayDimensions: ec.UInt32[];
  maxStringLength: ec.UInt32;
  dataSetFieldId: ec.Guid | null;
  properties: KeyValuePair[];

 constructor( options?: IFieldMetaData) {
  options = options || {};
  this.name = (options.name != null) ? options.name : null;
  this.description = (options.description != null) ? options.description : new LocalizedText();
  this.fieldFlags = (options.fieldFlags != null) ? options.fieldFlags : null;
  this.builtInType = (options.builtInType != null) ? options.builtInType : 0;
  this.dataType = (options.dataType != null) ? options.dataType : ec.NodeId.NullNodeId;
  this.valueRank = (options.valueRank != null) ? options.valueRank : 0;
  this.arrayDimensions = (options.arrayDimensions != null) ? options.arrayDimensions : [];
  this.maxStringLength = (options.maxStringLength != null) ? options.maxStringLength : 0;
  this.dataSetFieldId = (options.dataSetFieldId != null) ? options.dataSetFieldId : null;
  this.properties = (options.properties != null) ? options.properties : [];

 }


 encode( out: DataStream) {
  ec.encodeString(this.name, out);
  this.description.encode(out);
  encodeDataSetFieldFlags(this.fieldFlags, out);
  ec.encodeByte(this.builtInType, out);
  ec.encodeNodeId(this.dataType, out);
  ec.encodeInt32(this.valueRank, out);
  ec.encodeArray(this.arrayDimensions, out, ec.encodeUInt32);
  ec.encodeUInt32(this.maxStringLength, out);
  ec.encodeGuid(this.dataSetFieldId, out);
  ec.encodeArray(this.properties, out);

 }


 decode( inp: DataStream) {
  this.name = ec.decodeString(inp);
  this.description.decode(inp);
  this.fieldFlags = decodeDataSetFieldFlags(inp);
  this.builtInType = ec.decodeByte(inp);
  this.dataType = ec.decodeNodeId(inp);
  this.valueRank = ec.decodeInt32(inp);
  this.arrayDimensions = ec.decodeArray(inp, ec.decodeUInt32);
  this.maxStringLength = ec.decodeUInt32(inp);
  this.dataSetFieldId = ec.decodeGuid(inp);
  this.properties = ec.decodeArray(inp, decodeKeyValuePair);

 }


 toJSON() {
  const out: any = {};
  out.Name = this.name;
  out.Description = this.description;
  out.FieldFlags = this.fieldFlags;
  out.BuiltInType = this.builtInType;
  out.DataType = ec.jsonEncodeNodeId(this.dataType);
  out.ValueRank = this.valueRank;
  out.ArrayDimensions = this.arrayDimensions;
  out.MaxStringLength = this.maxStringLength;
  out.DataSetFieldId = this.dataSetFieldId;
  out.Properties = this.properties;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.name = inp.Name;
  this.description.fromJSON(inp.Description);
  this.fieldFlags = inp.FieldFlags;
  this.builtInType = inp.BuiltInType;
  this.dataType = ec.jsonDecodeNodeId(inp.DataType);
  this.valueRank = inp.ValueRank;
  this.arrayDimensions = inp.ArrayDimensions;
  this.maxStringLength = inp.MaxStringLength;
  this.dataSetFieldId = inp.DataSetFieldId;
  this.properties = ec.jsonDecodeStructArray( inp.Properties,KeyValuePair);

 }


 clone( target?: FieldMetaData): FieldMetaData {
  if (!target) {
   target = new FieldMetaData();
  }
  target.name = this.name;
  if (this.description) { target.description = this.description.clone(); }
  target.fieldFlags = this.fieldFlags;
  target.builtInType = this.builtInType;
  target.dataType = this.dataType;
  target.valueRank = this.valueRank;
  target.arrayDimensions = ec.cloneArray(this.arrayDimensions);
  target.maxStringLength = this.maxStringLength;
  target.dataSetFieldId = this.dataSetFieldId;
  if (this.properties) { target.properties = ec.cloneComplexArray(this.properties); }
  return target;
 }


}
export function decodeFieldMetaData( inp: DataStream): FieldMetaData {
  const obj = new FieldMetaData();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('FieldMetaData', FieldMetaData, new ExpandedNodeId(2 /*numeric id*/, 14524, 0));
