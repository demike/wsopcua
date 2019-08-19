

import * as ec from '../basic-types';
import {LocalizedText} from './LocalizedText';
import {FieldMetaData} from './FieldMetaData';
import {decodeFieldMetaData} from './FieldMetaData';
import {ConfigurationVersionDataType} from './ConfigurationVersionDataType';
import {DataStream} from '../basic-types/DataStream';
import {DataTypeSchemaHeader} from './DataTypeSchemaHeader';
import {IDataTypeSchemaHeader} from './DataTypeSchemaHeader';

export interface IDataSetMetaDataType extends IDataTypeSchemaHeader {
  noOfNamespaces?: ec.Int32;
  noOfStructureDataTypes?: ec.Int32;
  noOfEnumDataTypes?: ec.Int32;
  noOfSimpleDataTypes?: ec.Int32;
  name?: string;
  description?: LocalizedText;
  fields?: FieldMetaData[];
  dataSetClassId?: ec.Guid;
  configurationVersion?: ConfigurationVersionDataType;
}

/**

*/

export class DataSetMetaDataType extends DataTypeSchemaHeader {
  noOfNamespaces: ec.Int32;
  noOfStructureDataTypes: ec.Int32;
  noOfEnumDataTypes: ec.Int32;
  noOfSimpleDataTypes: ec.Int32;
  name: string;
  description: LocalizedText;
  fields: FieldMetaData[];
  dataSetClassId: ec.Guid;
  configurationVersion: ConfigurationVersionDataType;

 constructor( options?: IDataSetMetaDataType) {
  options = options || {};
  super(options);
  this.noOfNamespaces = (options.noOfNamespaces != null) ? options.noOfNamespaces : null;
  this.noOfStructureDataTypes = (options.noOfStructureDataTypes != null) ? options.noOfStructureDataTypes : null;
  this.noOfEnumDataTypes = (options.noOfEnumDataTypes != null) ? options.noOfEnumDataTypes : null;
  this.noOfSimpleDataTypes = (options.noOfSimpleDataTypes != null) ? options.noOfSimpleDataTypes : null;
  this.name = (options.name != null) ? options.name : null;
  this.description = (options.description != null) ? options.description : new LocalizedText();
  this.fields = (options.fields != null) ? options.fields : [];
  this.dataSetClassId = (options.dataSetClassId != null) ? options.dataSetClassId : null;
  this.configurationVersion = (options.configurationVersion != null) ? options.configurationVersion : new ConfigurationVersionDataType();

 }


 encode( out: DataStream) {
  super.encode(out);
  ec.encodeInt32(this.noOfNamespaces, out);
  ec.encodeInt32(this.noOfStructureDataTypes, out);
  ec.encodeInt32(this.noOfEnumDataTypes, out);
  ec.encodeInt32(this.noOfSimpleDataTypes, out);
  ec.encodeString(this.name, out);
  this.description.encode(out);
  ec.encodeArray(this.fields, out);
  ec.encodeGuid(this.dataSetClassId, out);
  this.configurationVersion.encode(out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.noOfNamespaces = ec.decodeInt32(inp);
  this.noOfStructureDataTypes = ec.decodeInt32(inp);
  this.noOfEnumDataTypes = ec.decodeInt32(inp);
  this.noOfSimpleDataTypes = ec.decodeInt32(inp);
  this.name = ec.decodeString(inp);
  this.description.decode(inp);
  this.fields = ec.decodeArray(inp, decodeFieldMetaData);
  this.dataSetClassId = ec.decodeGuid(inp);
  this.configurationVersion.decode(inp);

 }


 clone( target?: DataSetMetaDataType): DataSetMetaDataType {
  if (!target) {
   target = new DataSetMetaDataType();
  }
  super.clone(target);
  target.noOfNamespaces = this.noOfNamespaces;
  target.noOfStructureDataTypes = this.noOfStructureDataTypes;
  target.noOfEnumDataTypes = this.noOfEnumDataTypes;
  target.noOfSimpleDataTypes = this.noOfSimpleDataTypes;
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



