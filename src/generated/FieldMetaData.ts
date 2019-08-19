

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

*/

export class FieldMetaData {
  name: string;
  description: LocalizedText;
  fieldFlags: DataSetFieldFlags;
  builtInType: ec.Byte;
  dataType: ec.NodeId;
  valueRank: ec.Int32;
  arrayDimensions: ec.UInt32[];
  maxStringLength: ec.UInt32;
  dataSetFieldId: ec.Guid;
  properties: KeyValuePair[];

 constructor( options?: IFieldMetaData) {
  options = options || {};
  this.name = (options.name != null) ? options.name : null;
  this.description = (options.description != null) ? options.description : new LocalizedText();
  this.fieldFlags = (options.fieldFlags != null) ? options.fieldFlags : null;
  this.builtInType = (options.builtInType != null) ? options.builtInType : null;
  this.dataType = (options.dataType != null) ? options.dataType : null;
  this.valueRank = (options.valueRank != null) ? options.valueRank : null;
  this.arrayDimensions = (options.arrayDimensions != null) ? options.arrayDimensions : [];
  this.maxStringLength = (options.maxStringLength != null) ? options.maxStringLength : null;
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



