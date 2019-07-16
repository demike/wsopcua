

import * as ec from '../basic-types';
import {Variant} from '../variant';
import {DataSetMetaDataType} from './DataSetMetaDataType';
import {DataSetFieldContentMask, encodeDataSetFieldContentMask, decodeDataSetFieldContentMask} from './DataSetFieldContentMask';
import {MessageSecurityMode, encodeMessageSecurityMode, decodeMessageSecurityMode} from './MessageSecurityMode';
import {EndpointDescription} from './EndpointDescription';
import {decodeEndpointDescription} from './EndpointDescription';
import {KeyValuePair} from './KeyValuePair';
import {decodeKeyValuePair} from './KeyValuePair';
import {ExtensionObject, encodeExtensionObject, decodeExtensionObject} from '../basic-types/extension_object';
import {DataStream} from '../basic-types/DataStream';

export interface IDataSetReaderDataType {
  name?: string;
  enabled?: boolean;
  publisherId?: Variant;
  writerGroupId?: ec.UInt16;
  dataSetWriterId?: ec.UInt16;
  dataSetMetaData?: DataSetMetaDataType;
  dataSetFieldContentMask?: DataSetFieldContentMask;
  messageReceiveTimeout?: ec.Double;
  keyFrameCount?: ec.UInt32;
  headerLayoutUri?: string;
  securityMode?: MessageSecurityMode;
  securityGroupId?: string;
  securityKeyServices?: EndpointDescription[];
  dataSetReaderProperties?: KeyValuePair[];
  transportSettings?: ExtensionObject;
  messageSettings?: ExtensionObject;
  subscribedDataSet?: ExtensionObject;
}

/**

*/

export class DataSetReaderDataType {
  name: string;
  enabled: boolean;
  publisherId: Variant;
  writerGroupId: ec.UInt16;
  dataSetWriterId: ec.UInt16;
  dataSetMetaData: DataSetMetaDataType;
  dataSetFieldContentMask: DataSetFieldContentMask;
  messageReceiveTimeout: ec.Double;
  keyFrameCount: ec.UInt32;
  headerLayoutUri: string;
  securityMode: MessageSecurityMode;
  securityGroupId: string;
  securityKeyServices: EndpointDescription[];
  dataSetReaderProperties: KeyValuePair[];
  transportSettings: ExtensionObject;
  messageSettings: ExtensionObject;
  subscribedDataSet: ExtensionObject;

 constructor( options?: IDataSetReaderDataType) {
  options = options || {};
  this.name = (options.name !== undefined) ? options.name : null;
  this.enabled = (options.enabled !== undefined) ? options.enabled : null;
  this.publisherId = (options.publisherId !== undefined) ? options.publisherId : new Variant();
  this.writerGroupId = (options.writerGroupId !== undefined) ? options.writerGroupId : null;
  this.dataSetWriterId = (options.dataSetWriterId !== undefined) ? options.dataSetWriterId : null;
  this.dataSetMetaData = (options.dataSetMetaData !== undefined) ? options.dataSetMetaData : new DataSetMetaDataType();
  this.dataSetFieldContentMask = (options.dataSetFieldContentMask !== undefined) ? options.dataSetFieldContentMask : null;
  this.messageReceiveTimeout = (options.messageReceiveTimeout !== undefined) ? options.messageReceiveTimeout : null;
  this.keyFrameCount = (options.keyFrameCount !== undefined) ? options.keyFrameCount : null;
  this.headerLayoutUri = (options.headerLayoutUri !== undefined) ? options.headerLayoutUri : null;
  this.securityMode = (options.securityMode !== undefined) ? options.securityMode : null;
  this.securityGroupId = (options.securityGroupId !== undefined) ? options.securityGroupId : null;
  this.securityKeyServices = (options.securityKeyServices !== undefined) ? options.securityKeyServices : [];
  this.dataSetReaderProperties = (options.dataSetReaderProperties !== undefined) ? options.dataSetReaderProperties : [];
  this.transportSettings = (options.transportSettings !== undefined) ? options.transportSettings : null;
  this.messageSettings = (options.messageSettings !== undefined) ? options.messageSettings : null;
  this.subscribedDataSet = (options.subscribedDataSet !== undefined) ? options.subscribedDataSet : null;

 }


 encode( out: DataStream) {
  ec.encodeString(this.name, out);
  ec.encodeBoolean(this.enabled, out);
  this.publisherId.encode(out);
  ec.encodeUInt16(this.writerGroupId, out);
  ec.encodeUInt16(this.dataSetWriterId, out);
  this.dataSetMetaData.encode(out);
  encodeDataSetFieldContentMask(this.dataSetFieldContentMask, out);
  ec.encodeDouble(this.messageReceiveTimeout, out);
  ec.encodeUInt32(this.keyFrameCount, out);
  ec.encodeString(this.headerLayoutUri, out);
  encodeMessageSecurityMode(this.securityMode, out);
  ec.encodeString(this.securityGroupId, out);
  ec.encodeArray(this.securityKeyServices, out);
  ec.encodeArray(this.dataSetReaderProperties, out);
  encodeExtensionObject(this.transportSettings, out);
  encodeExtensionObject(this.messageSettings, out);
  encodeExtensionObject(this.subscribedDataSet, out);

 }


 decode( inp: DataStream) {
  this.name = ec.decodeString(inp);
  this.enabled = ec.decodeBoolean(inp);
  this.publisherId.decode(inp);
  this.writerGroupId = ec.decodeUInt16(inp);
  this.dataSetWriterId = ec.decodeUInt16(inp);
  this.dataSetMetaData.decode(inp);
  this.dataSetFieldContentMask = decodeDataSetFieldContentMask(inp);
  this.messageReceiveTimeout = ec.decodeDouble(inp);
  this.keyFrameCount = ec.decodeUInt32(inp);
  this.headerLayoutUri = ec.decodeString(inp);
  this.securityMode = decodeMessageSecurityMode(inp);
  this.securityGroupId = ec.decodeString(inp);
  this.securityKeyServices = ec.decodeArray(inp, decodeEndpointDescription);
  this.dataSetReaderProperties = ec.decodeArray(inp, decodeKeyValuePair);
  this.transportSettings = decodeExtensionObject(inp);
  this.messageSettings = decodeExtensionObject(inp);
  this.subscribedDataSet = decodeExtensionObject(inp);

 }


 clone( target?: DataSetReaderDataType): DataSetReaderDataType {
  if (!target) {
   target = new DataSetReaderDataType();
  }
  target.name = this.name;
  target.enabled = this.enabled;
  if (this.publisherId) { target.publisherId = this.publisherId.clone(); }
  target.writerGroupId = this.writerGroupId;
  target.dataSetWriterId = this.dataSetWriterId;
  if (this.dataSetMetaData) { target.dataSetMetaData = this.dataSetMetaData.clone(); }
  target.dataSetFieldContentMask = this.dataSetFieldContentMask;
  target.messageReceiveTimeout = this.messageReceiveTimeout;
  target.keyFrameCount = this.keyFrameCount;
  target.headerLayoutUri = this.headerLayoutUri;
  target.securityMode = this.securityMode;
  target.securityGroupId = this.securityGroupId;
  if (this.securityKeyServices) { target.securityKeyServices = ec.cloneComplexArray(this.securityKeyServices); }
  if (this.dataSetReaderProperties) { target.dataSetReaderProperties = ec.cloneComplexArray(this.dataSetReaderProperties); }
  target.transportSettings = this.transportSettings;
  target.messageSettings = this.messageSettings;
  target.subscribedDataSet = this.subscribedDataSet;
  return target;
 }


}
export function decodeDataSetReaderDataType( inp: DataStream): DataSetReaderDataType {
  const obj = new DataSetReaderDataType();
   obj.decode(inp);
   return obj;

 }



