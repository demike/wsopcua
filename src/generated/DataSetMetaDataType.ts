/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {LocalizedText} from '.';
import {FieldMetaData} from '.';
import {decodeFieldMetaData} from '.';
import {ConfigurationVersionDataType} from '.';
import {DataStream} from '../basic-types';
import {DataTypeSchemaHeader} from '.';
import {IDataTypeSchemaHeader} from '.';

export interface IDataSetMetaDataType extends IDataTypeSchemaHeader {
  name?: string;
  description?: LocalizedText;
  fields?: FieldMetaData[];
  dataSetClassId?: ec.Guid;
  configurationVersion?: ConfigurationVersionDataType;
}

/**

*/

export class DataSetMetaDataType extends DataTypeSchemaHeader {
  name: string | null;
  description: LocalizedText;
  fields: FieldMetaData[];
  dataSetClassId: ec.Guid | null;
  configurationVersion: ConfigurationVersionDataType;

 constructor( options?: IDataSetMetaDataType) {
  options = options || {};
  super(options);
  this.name = (options.name != null) ? options.name : null;
  this.description = (options.description != null) ? options.description : new LocalizedText();
  this.fields = (options.fields != null) ? options.fields : [];
  this.dataSetClassId = (options.dataSetClassId != null) ? options.dataSetClassId : null;
  this.configurationVersion = (options.configurationVersion != null) ? options.configurationVersion : new ConfigurationVersionDataType();

 }


 encode( out: DataStream) {
  super.encode(out);
  ec.encodeString(this.name, out);
  this.description.encode(out);
  ec.encodeArray(this.fields, out);
  ec.encodeGuid(this.dataSetClassId, out);
  this.configurationVersion.encode(out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.name = ec.decodeString(inp);
  this.description.decode(inp);
  this.fields = ec.decodeArray(inp, decodeFieldMetaData);
  this.dataSetClassId = ec.decodeGuid(inp);
  this.configurationVersion.decode(inp);

 }


 toJSON() {
  const out: any = super.toJSON();
  out.Name = this.name;
  out.Description = this.description;
  out.Fields = this.fields;
  out.DataSetClassId = this.dataSetClassId;
  out.ConfigurationVersion = this.configurationVersion;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  super.fromJSON(inp);
  this.name = inp.Name;
  this.description.fromJSON(inp.Description);
  this.fields = ec.jsonDecodeStructArray( inp.Fields,FieldMetaData);
  this.dataSetClassId = inp.DataSetClassId;
  this.configurationVersion.fromJSON(inp.ConfigurationVersion);

 }


 clone( target?: DataSetMetaDataType): DataSetMetaDataType {
  if (!target) {
   target = new DataSetMetaDataType();
  }
  super.clone(target);
  target.name = this.name;
  if (this.description) { target.description = this.description.clone(); }
  if (this.fields) { target.fields = ec.cloneComplexArray(this.fields); }
  target.dataSetClassId = this.dataSetClassId;
  if (this.configurationVersion) { target.configurationVersion = this.configurationVersion.clone(); }
  return target;
 }


}
export function decodeDataSetMetaDataType( inp: DataStream): DataSetMetaDataType {
  const obj = new DataSetMetaDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory';
import { ExpandedNodeId } from '../nodeid';
register_class_definition('DataSetMetaDataType', DataSetMetaDataType, new ExpandedNodeId(2 /*numeric id*/, 124, 0));
