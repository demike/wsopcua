/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataSetMetaDataType} from './DataSetMetaDataType';
import {KeyValuePair} from './KeyValuePair';
import {decodeKeyValuePair} from './KeyValuePair';
import {ExtensionObject, encodeExtensionObject, decodeExtensionObject, jsonEncodeExtensionObject, jsonDecodeExtensionObject} from '../basic-types/extension_object';
import {DataStream} from '../basic-types/DataStream';

export type IPublishedDataSetDataType = Partial<PublishedDataSetDataType>;

/**

*/

export class PublishedDataSetDataType {
  name: string | null;
  dataSetFolder: (string | null)[];
  dataSetMetaData: DataSetMetaDataType;
  extensionFields: (KeyValuePair)[];
  dataSetSource: ExtensionObject | null;

 constructor( options?: IPublishedDataSetDataType | null) {
  options = options || {};
  this.name = (options.name != null) ? options.name : null;
  this.dataSetFolder = (options.dataSetFolder != null) ? options.dataSetFolder : [];
  this.dataSetMetaData = (options.dataSetMetaData != null) ? options.dataSetMetaData : new DataSetMetaDataType();
  this.extensionFields = (options.extensionFields != null) ? options.extensionFields : [];
  this.dataSetSource = (options.dataSetSource != null) ? options.dataSetSource : null;

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
  this.dataSetFolder = ec.decodeArray(inp, ec.decodeString) ?? [];
  this.dataSetMetaData.decode(inp);
  this.extensionFields = ec.decodeArray(inp, decodeKeyValuePair) ?? [];
  this.dataSetSource = decodeExtensionObject(inp);

 }


 toJSON() {
  const out: any = {};
  out.Name = this.name;
  out.DataSetFolder = this.dataSetFolder;
  out.DataSetMetaData = this.dataSetMetaData;
  out.ExtensionFields = this.extensionFields;
  out.DataSetSource = jsonEncodeExtensionObject(this.dataSetSource);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.name = inp.Name;
  this.dataSetFolder = inp.DataSetFolder;
  this.dataSetMetaData.fromJSON(inp.DataSetMetaData);
  this.extensionFields = ec.jsonDecodeStructArray( inp.ExtensionFields,KeyValuePair);
  this.dataSetSource = jsonDecodeExtensionObject(inp.DataSetSource);

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



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('PublishedDataSetDataType', PublishedDataSetDataType, new ExpandedNodeId(2 /*numeric id*/, 15677, 0));
