/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataSetFieldContentMask, encodeDataSetFieldContentMask, decodeDataSetFieldContentMask} from '.';
import {KeyValuePair} from '.';
import {decodeKeyValuePair} from '.';
import {ExtensionObject, encodeExtensionObject, decodeExtensionObject, jsonEncodeExtensionObject, jsonDecodeExtensionObject} from '../basic-types/extension_object';
import {DataStream} from '../basic-types';

export interface IDataSetWriterDataType {
  name?: string;
  enabled?: boolean;
  dataSetWriterId?: ec.UInt16;
  dataSetFieldContentMask?: DataSetFieldContentMask;
  keyFrameCount?: ec.UInt32;
  dataSetName?: string;
  dataSetWriterProperties?: KeyValuePair[];
  transportSettings?: ExtensionObject;
  messageSettings?: ExtensionObject;
}

/**

*/

export class DataSetWriterDataType {
  name: string | null;
  enabled: boolean;
  dataSetWriterId: ec.UInt16;
  dataSetFieldContentMask: DataSetFieldContentMask;
  keyFrameCount: ec.UInt32;
  dataSetName: string | null;
  dataSetWriterProperties: KeyValuePair[];
  transportSettings: ExtensionObject | null;
  messageSettings: ExtensionObject | null;

 constructor( options?: IDataSetWriterDataType) {
  options = options || {};
  this.name = (options.name != null) ? options.name : null;
  this.enabled = (options.enabled != null) ? options.enabled : false;
  this.dataSetWriterId = (options.dataSetWriterId != null) ? options.dataSetWriterId : 0;
  this.dataSetFieldContentMask = (options.dataSetFieldContentMask != null) ? options.dataSetFieldContentMask : null;
  this.keyFrameCount = (options.keyFrameCount != null) ? options.keyFrameCount : 0;
  this.dataSetName = (options.dataSetName != null) ? options.dataSetName : null;
  this.dataSetWriterProperties = (options.dataSetWriterProperties != null) ? options.dataSetWriterProperties : [];
  this.transportSettings = (options.transportSettings != null) ? options.transportSettings : null;
  this.messageSettings = (options.messageSettings != null) ? options.messageSettings : null;

 }


 encode( out: DataStream) {
  ec.encodeString(this.name, out);
  ec.encodeBoolean(this.enabled, out);
  ec.encodeUInt16(this.dataSetWriterId, out);
  encodeDataSetFieldContentMask(this.dataSetFieldContentMask, out);
  ec.encodeUInt32(this.keyFrameCount, out);
  ec.encodeString(this.dataSetName, out);
  ec.encodeArray(this.dataSetWriterProperties, out);
  encodeExtensionObject(this.transportSettings, out);
  encodeExtensionObject(this.messageSettings, out);

 }


 decode( inp: DataStream) {
  this.name = ec.decodeString(inp);
  this.enabled = ec.decodeBoolean(inp);
  this.dataSetWriterId = ec.decodeUInt16(inp);
  this.dataSetFieldContentMask = decodeDataSetFieldContentMask(inp);
  this.keyFrameCount = ec.decodeUInt32(inp);
  this.dataSetName = ec.decodeString(inp);
  this.dataSetWriterProperties = ec.decodeArray(inp, decodeKeyValuePair);
  this.transportSettings = decodeExtensionObject(inp);
  this.messageSettings = decodeExtensionObject(inp);

 }


 toJSON() {
  const out: any = {};
  out.Name = this.name;
  out.Enabled = this.enabled;
  out.DataSetWriterId = this.dataSetWriterId;
  out.DataSetFieldContentMask = this.dataSetFieldContentMask;
  out.KeyFrameCount = this.keyFrameCount;
  out.DataSetName = this.dataSetName;
  out.DataSetWriterProperties = this.dataSetWriterProperties;
  out.TransportSettings = jsonEncodeExtensionObject(this.transportSettings);
  out.MessageSettings = jsonEncodeExtensionObject(this.messageSettings);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.name = inp.Name;
  this.enabled = inp.Enabled;
  this.dataSetWriterId = inp.DataSetWriterId;
  this.dataSetFieldContentMask = inp.DataSetFieldContentMask;
  this.keyFrameCount = inp.KeyFrameCount;
  this.dataSetName = inp.DataSetName;
  this.dataSetWriterProperties = ec.jsonDecodeStructArray( inp.DataSetWriterProperties,KeyValuePair);
  this.transportSettings = jsonDecodeExtensionObject(inp.TransportSettings);
  this.messageSettings = jsonDecodeExtensionObject(inp.MessageSettings);

 }


 clone( target?: DataSetWriterDataType): DataSetWriterDataType {
  if (!target) {
   target = new DataSetWriterDataType();
  }
  target.name = this.name;
  target.enabled = this.enabled;
  target.dataSetWriterId = this.dataSetWriterId;
  target.dataSetFieldContentMask = this.dataSetFieldContentMask;
  target.keyFrameCount = this.keyFrameCount;
  target.dataSetName = this.dataSetName;
  if (this.dataSetWriterProperties) { target.dataSetWriterProperties = ec.cloneComplexArray(this.dataSetWriterProperties); }
  target.transportSettings = this.transportSettings;
  target.messageSettings = this.messageSettings;
  return target;
 }


}
export function decodeDataSetWriterDataType( inp: DataStream): DataSetWriterDataType {
  const obj = new DataSetWriterDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory';
import { ExpandedNodeId } from '../nodeid';
register_class_definition('DataSetWriterDataType', DataSetWriterDataType, new ExpandedNodeId(2 /*numeric id*/, 15682, 0));
