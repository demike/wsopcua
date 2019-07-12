

import * as ec from '../basic-types';
import {DataSetMetaDataType} from './DataSetMetaDataType';
import {KeyValuePair} from './KeyValuePair';
import {decodeKeyValuePair} from './KeyValuePair';
import {ExtensionObject, encodeExtensionObject, decodeExtensionObject} from '../basic-types/extension_object';
import {DataStream} from '../basic-types/DataStream';

export interface IPublishedDataSetDataType {
  name?: string;
  dataSetFolder?: string[];
  dataSetMetaData?: DataSetMetaDataType;
  extensionFields?: KeyValuePair[];
  dataSetSource?: ExtensionObject;
}

/**

*/

export class PublishedDataSetDataType {
  name: string;
  dataSetFolder: string[];
  dataSetMetaData: DataSetMetaDataType;
  extensionFields: KeyValuePair[];
  dataSetSource: ExtensionObject;

 constructor( options?: IPublishedDataSetDataType) {
  options = options || {};
  this.name = (options.name) ? options.name : null;
  this.dataSetFolder = (options.dataSetFolder) ? options.dataSetFolder : [];
  this.dataSetMetaData = (options.dataSetMetaData) ? options.dataSetMetaData : new DataSetMetaDataType();
  this.extensionFields = (options.extensionFields) ? options.extensionFields : [];
  this.dataSetSource = (options.dataSetSource) ? options.dataSetSource : null;

 }


 encode( out: DataStream) {
  ec.encodeString(this.name, out);
  ec.encodeArray(this.dataSetFolder, out, ec.encodeString);
  this.dataSetMetaData.encode(out);
  ec.encodeArray(this.extensionFields, out);
  encodeExtensionObject(this.dataSetSource, out);

 }


 decode( inp: DataStream) {
  this.name = ec.decodeString(inp);
  this.dataSetFolder = ec.decodeArray(inp, ec.decodeString);
  this.dataSetMetaData.decode(inp);
  this.extensionFields = ec.decodeArray(inp, decodeKeyValuePair);
  this.dataSetSource = decodeExtensionObject(inp);

 }


 clone( target?: PublishedDataSetDataType): PublishedDataSetDataType {
  if (!target) {
   target = new PublishedDataSetDataType();
  }
  target.name = this.name;
  target.dataSetFolder = ec.cloneArray(this.dataSetFolder);
  if (this.dataSetMetaData) { target.dataSetMetaData = this.dataSetMetaData.clone(); }
  if (this.extensionFields) { target.extensionFields = ec.cloneComplexArray(this.extensionFields); }
  target.dataSetSource = this.dataSetSource;
  return target;
 }


}
export function decodePublishedDataSetDataType( inp: DataStream): PublishedDataSetDataType {
  const obj = new PublishedDataSetDataType();
   obj.decode(inp);
   return obj;

 }



