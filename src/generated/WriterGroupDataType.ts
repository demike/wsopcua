

import * as ec from '../basic-types';
import {ExtensionObject, encodeExtensionObject, decodeExtensionObject} from '../basic-types/extension_object';
import {DataSetWriterDataType} from './DataSetWriterDataType';
import {decodeDataSetWriterDataType} from './DataSetWriterDataType';
import {DataStream} from '../basic-types/DataStream';
import {PubSubGroupDataType} from './PubSubGroupDataType';
import {IPubSubGroupDataType} from './PubSubGroupDataType';

export interface IWriterGroupDataType extends IPubSubGroupDataType {
  noOfSecurityKeyServices?: ec.Int32;
  noOfGroupProperties?: ec.Int32;
  writerGroupId?: ec.UInt16;
  publishingInterval?: ec.Double;
  keepAliveTime?: ec.Double;
  priority?: ec.Byte;
  localeIds?: string[];
  headerLayoutUri?: string;
  transportSettings?: ExtensionObject;
  messageSettings?: ExtensionObject;
  dataSetWriters?: DataSetWriterDataType[];
}

/**

*/

export class WriterGroupDataType extends PubSubGroupDataType {
  noOfSecurityKeyServices: ec.Int32;
  noOfGroupProperties: ec.Int32;
  writerGroupId: ec.UInt16;
  publishingInterval: ec.Double;
  keepAliveTime: ec.Double;
  priority: ec.Byte;
  localeIds: string[];
  headerLayoutUri: string;
  transportSettings: ExtensionObject;
  messageSettings: ExtensionObject;
  dataSetWriters: DataSetWriterDataType[];

 constructor( options?: IWriterGroupDataType) {
  options = options || {};
  super(options);
  this.noOfSecurityKeyServices = (options.noOfSecurityKeyServices != null) ? options.noOfSecurityKeyServices : null;
  this.noOfGroupProperties = (options.noOfGroupProperties != null) ? options.noOfGroupProperties : null;
  this.writerGroupId = (options.writerGroupId != null) ? options.writerGroupId : null;
  this.publishingInterval = (options.publishingInterval != null) ? options.publishingInterval : null;
  this.keepAliveTime = (options.keepAliveTime != null) ? options.keepAliveTime : null;
  this.priority = (options.priority != null) ? options.priority : null;
  this.localeIds = (options.localeIds != null) ? options.localeIds : [];
  this.headerLayoutUri = (options.headerLayoutUri != null) ? options.headerLayoutUri : null;
  this.transportSettings = (options.transportSettings != null) ? options.transportSettings : null;
  this.messageSettings = (options.messageSettings != null) ? options.messageSettings : null;
  this.dataSetWriters = (options.dataSetWriters != null) ? options.dataSetWriters : [];

 }


 encode( out: DataStream) {
  super.encode(out);
  ec.encodeInt32(this.noOfSecurityKeyServices, out);
  ec.encodeInt32(this.noOfGroupProperties, out);
  ec.encodeUInt16(this.writerGroupId, out);
  ec.encodeDouble(this.publishingInterval, out);
  ec.encodeDouble(this.keepAliveTime, out);
  ec.encodeByte(this.priority, out);
  ec.encodeArray(this.localeIds, out, ec.encodeString);
  ec.encodeString(this.headerLayoutUri, out);
  encodeExtensionObject(this.transportSettings, out);
  encodeExtensionObject(this.messageSettings, out);
  ec.encodeArray(this.dataSetWriters, out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.noOfSecurityKeyServices = ec.decodeInt32(inp);
  this.noOfGroupProperties = ec.decodeInt32(inp);
  this.writerGroupId = ec.decodeUInt16(inp);
  this.publishingInterval = ec.decodeDouble(inp);
  this.keepAliveTime = ec.decodeDouble(inp);
  this.priority = ec.decodeByte(inp);
  this.localeIds = ec.decodeArray(inp, ec.decodeString);
  this.headerLayoutUri = ec.decodeString(inp);
  this.transportSettings = decodeExtensionObject(inp);
  this.messageSettings = decodeExtensionObject(inp);
  this.dataSetWriters = ec.decodeArray(inp, decodeDataSetWriterDataType);

 }


 clone( target?: WriterGroupDataType): WriterGroupDataType {
  if (!target) {
   target = new WriterGroupDataType();
  }
  super.clone(target);
  target.noOfSecurityKeyServices = this.noOfSecurityKeyServices;
  target.noOfGroupProperties = this.noOfGroupProperties;
  target.writerGroupId = this.writerGroupId;
  target.publishingInterval = this.publishingInterval;
  target.keepAliveTime = this.keepAliveTime;
  target.priority = this.priority;
  target.localeIds = ec.cloneArray(this.localeIds);
  target.headerLayoutUri = this.headerLayoutUri;
  target.transportSettings = this.transportSettings;
  target.messageSettings = this.messageSettings;
  if (this.dataSetWriters) { target.dataSetWriters = ec.cloneComplexArray(this.dataSetWriters); }
  return target;
 }


}
export function decodeWriterGroupDataType( inp: DataStream): WriterGroupDataType {
  const obj = new WriterGroupDataType();
   obj.decode(inp);
   return obj;

 }



