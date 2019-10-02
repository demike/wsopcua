/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {Variant} from '../variant';
import {ExtensionObject, encodeExtensionObject, decodeExtensionObject} from '../basic-types/extension_object';
import {KeyValuePair} from './KeyValuePair';
import {decodeKeyValuePair} from './KeyValuePair';
import {WriterGroupDataType} from './WriterGroupDataType';
import {decodeWriterGroupDataType} from './WriterGroupDataType';
import {ReaderGroupDataType} from './ReaderGroupDataType';
import {decodeReaderGroupDataType} from './ReaderGroupDataType';
import {DataStream} from '../basic-types/DataStream';

export interface IPubSubConnectionDataType {
  name?: string;
  enabled?: boolean;
  publisherId?: Variant;
  transportProfileUri?: string;
  address?: ExtensionObject;
  connectionProperties?: KeyValuePair[];
  transportSettings?: ExtensionObject;
  writerGroups?: WriterGroupDataType[];
  readerGroups?: ReaderGroupDataType[];
}

/**

*/

export class PubSubConnectionDataType {
  name: string | null;
  enabled: boolean;
  publisherId: Variant;
  transportProfileUri: string | null;
  address: ExtensionObject | null;
  connectionProperties: KeyValuePair[];
  transportSettings: ExtensionObject | null;
  writerGroups: WriterGroupDataType[];
  readerGroups: ReaderGroupDataType[];

 constructor( options?: IPubSubConnectionDataType) {
  options = options || {};
  this.name = (options.name != null) ? options.name : null;
  this.enabled = (options.enabled != null) ? options.enabled : false;
  this.publisherId = (options.publisherId != null) ? options.publisherId : new Variant();
  this.transportProfileUri = (options.transportProfileUri != null) ? options.transportProfileUri : null;
  this.address = (options.address != null) ? options.address : null;
  this.connectionProperties = (options.connectionProperties != null) ? options.connectionProperties : [];
  this.transportSettings = (options.transportSettings != null) ? options.transportSettings : null;
  this.writerGroups = (options.writerGroups != null) ? options.writerGroups : [];
  this.readerGroups = (options.readerGroups != null) ? options.readerGroups : [];

 }


 encode( out: DataStream) {
  ec.encodeString(this.name, out);
  ec.encodeBoolean(this.enabled, out);
  this.publisherId.encode(out);
  ec.encodeString(this.transportProfileUri, out);
  encodeExtensionObject(this.address, out);
  ec.encodeArray(this.connectionProperties, out);
  encodeExtensionObject(this.transportSettings, out);
  ec.encodeArray(this.writerGroups, out);
  ec.encodeArray(this.readerGroups, out);

 }


 decode( inp: DataStream) {
  this.name = ec.decodeString(inp);
  this.enabled = ec.decodeBoolean(inp);
  this.publisherId.decode(inp);
  this.transportProfileUri = ec.decodeString(inp);
  this.address = decodeExtensionObject(inp);
  this.connectionProperties = ec.decodeArray(inp, decodeKeyValuePair);
  this.transportSettings = decodeExtensionObject(inp);
  this.writerGroups = ec.decodeArray(inp, decodeWriterGroupDataType);
  this.readerGroups = ec.decodeArray(inp, decodeReaderGroupDataType);

 }


 clone( target?: PubSubConnectionDataType): PubSubConnectionDataType {
  if (!target) {
   target = new PubSubConnectionDataType();
  }
  target.name = this.name;
  target.enabled = this.enabled;
  if (this.publisherId) { target.publisherId = this.publisherId.clone(); }
  target.transportProfileUri = this.transportProfileUri;
  target.address = this.address;
  if (this.connectionProperties) { target.connectionProperties = ec.cloneComplexArray(this.connectionProperties); }
  target.transportSettings = this.transportSettings;
  if (this.writerGroups) { target.writerGroups = ec.cloneComplexArray(this.writerGroups); }
  if (this.readerGroups) { target.readerGroups = ec.cloneComplexArray(this.readerGroups); }
  return target;
 }


}
export function decodePubSubConnectionDataType( inp: DataStream): PubSubConnectionDataType {
  const obj = new PubSubConnectionDataType();
   obj.decode(inp);
   return obj;

 }



