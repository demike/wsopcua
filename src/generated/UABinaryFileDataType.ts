

import * as ec from '../basic-types';
import {KeyValuePair} from './KeyValuePair';
import {decodeKeyValuePair} from './KeyValuePair';
import {Variant} from '../variant';
import {DataStream} from '../basic-types/DataStream';
import {DataTypeSchemaHeader} from './DataTypeSchemaHeader';
import {IDataTypeSchemaHeader} from './DataTypeSchemaHeader';

export interface IUABinaryFileDataType extends IDataTypeSchemaHeader {
  noOfNamespaces?: ec.Int32;
  noOfStructureDataTypes?: ec.Int32;
  noOfEnumDataTypes?: ec.Int32;
  noOfSimpleDataTypes?: ec.Int32;
  schemaLocation?: string;
  fileHeader?: KeyValuePair[];
  body?: Variant;
}

/**

*/

export class UABinaryFileDataType extends DataTypeSchemaHeader {
  noOfNamespaces: ec.Int32;
  noOfStructureDataTypes: ec.Int32;
  noOfEnumDataTypes: ec.Int32;
  noOfSimpleDataTypes: ec.Int32;
  schemaLocation: string;
  fileHeader: KeyValuePair[];
  body: Variant;

 constructor( options?: IUABinaryFileDataType) {
  options = options || {};
  super(options);
  this.noOfNamespaces = (options.noOfNamespaces !== undefined) ? options.noOfNamespaces : null;
  this.noOfStructureDataTypes = (options.noOfStructureDataTypes !== undefined) ? options.noOfStructureDataTypes : null;
  this.noOfEnumDataTypes = (options.noOfEnumDataTypes !== undefined) ? options.noOfEnumDataTypes : null;
  this.noOfSimpleDataTypes = (options.noOfSimpleDataTypes !== undefined) ? options.noOfSimpleDataTypes : null;
  this.schemaLocation = (options.schemaLocation !== undefined) ? options.schemaLocation : null;
  this.fileHeader = (options.fileHeader !== undefined) ? options.fileHeader : [];
  this.body = (options.body !== undefined) ? options.body : new Variant();

 }


 encode( out: DataStream) {
  super.encode(out);
  ec.encodeInt32(this.noOfNamespaces, out);
  ec.encodeInt32(this.noOfStructureDataTypes, out);
  ec.encodeInt32(this.noOfEnumDataTypes, out);
  ec.encodeInt32(this.noOfSimpleDataTypes, out);
  ec.encodeString(this.schemaLocation, out);
  ec.encodeArray(this.fileHeader, out);
  this.body.encode(out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.noOfNamespaces = ec.decodeInt32(inp);
  this.noOfStructureDataTypes = ec.decodeInt32(inp);
  this.noOfEnumDataTypes = ec.decodeInt32(inp);
  this.noOfSimpleDataTypes = ec.decodeInt32(inp);
  this.schemaLocation = ec.decodeString(inp);
  this.fileHeader = ec.decodeArray(inp, decodeKeyValuePair);
  this.body.decode(inp);

 }


 clone( target?: UABinaryFileDataType): UABinaryFileDataType {
  if (!target) {
   target = new UABinaryFileDataType();
  }
  super.clone(target);
  target.noOfNamespaces = this.noOfNamespaces;
  target.noOfStructureDataTypes = this.noOfStructureDataTypes;
  target.noOfEnumDataTypes = this.noOfEnumDataTypes;
  target.noOfSimpleDataTypes = this.noOfSimpleDataTypes;
  target.schemaLocation = this.schemaLocation;
  if (this.fileHeader) { target.fileHeader = ec.cloneComplexArray(this.fileHeader); }
  if (this.body) { target.body = this.body.clone(); }
  return target;
 }


}
export function decodeUABinaryFileDataType( inp: DataStream): UABinaryFileDataType {
  const obj = new UABinaryFileDataType();
   obj.decode(inp);
   return obj;

 }


