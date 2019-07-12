

import * as ec from '../basic-types';
import {DataSetFieldContentMask, encodeDataSetFieldContentMask, decodeDataSetFieldContentMask} from './DataSetFieldContentMask';
import {KeyValuePair} from './KeyValuePair';
import {decodeKeyValuePair} from './KeyValuePair';
import {ExtensionObject, encodeExtensionObject, decodeExtensionObject} from '../basic-types/extension_object';
import {DataStream} from '../basic-types/DataStream';

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
  name: string;
  enabled: boolean;
  dataSetWriterId: ec.UInt16;
  dataSetFieldContentMask: DataSetFieldContentMask;
  keyFrameCount: ec.UInt32;
  dataSetName: string;
  dataSetWriterProperties: KeyValuePair[];
  transportSettings: ExtensionObject;
  messageSettings: ExtensionObject;

 constructor( options?: IDataSetWriterDataType) {
  options = options || {};
  this.name = (options.name) ? options.name : null;
  this.enabled = (options.enabled) ? options.enabled : null;
  this.dataSetWriterId = (options.dataSetWriterId) ? options.dataSetWriterId : null;
  this.dataSetFieldContentMask = (options.dataSetFieldContentMask) ? options.dataSetFieldContentMask : null;
  this.keyFrameCount = (options.keyFrameCount) ? options.keyFrameCount : null;
  this.dataSetName = (options.dataSetName) ? options.dataSetName : null;
  this.dataSetWriterProperties = (options.dataSetWriterProperties) ? options.dataSetWriterProperties : [];
  this.transportSettings = (options.transportSettings) ? options.transportSettings : null;
  this.messageSettings = (options.messageSettings) ? options.messageSettings : null;

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



