

import * as ec from '../basic-types';
import {StructureDescription} from './StructureDescription';
import {decodeStructureDescription} from './StructureDescription';
import {EnumDescription} from './EnumDescription';
import {decodeEnumDescription} from './EnumDescription';
import {SimpleTypeDescription} from './SimpleTypeDescription';
import {decodeSimpleTypeDescription} from './SimpleTypeDescription';
import {DataStream} from '../basic-types/DataStream';

export interface IDataTypeSchemaHeader {
  namespaces?: string[];
  structureDataTypes?: StructureDescription[];
  enumDataTypes?: EnumDescription[];
  simpleDataTypes?: SimpleTypeDescription[];
}

/**

*/

export class DataTypeSchemaHeader {
  namespaces: string[];
  structureDataTypes: StructureDescription[];
  enumDataTypes: EnumDescription[];
  simpleDataTypes: SimpleTypeDescription[];

 constructor( options?: IDataTypeSchemaHeader) {
  options = options || {};
  this.namespaces = (options.namespaces) ? options.namespaces : [];
  this.structureDataTypes = (options.structureDataTypes) ? options.structureDataTypes : [];
  this.enumDataTypes = (options.enumDataTypes) ? options.enumDataTypes : [];
  this.simpleDataTypes = (options.simpleDataTypes) ? options.simpleDataTypes : [];

 }


 encode( out: DataStream) {
  ec.encodeArray(this.namespaces, out, ec.encodeString);
  ec.encodeArray(this.structureDataTypes, out);
  ec.encodeArray(this.enumDataTypes, out);
  ec.encodeArray(this.simpleDataTypes, out);

 }


 decode( inp: DataStream) {
  this.namespaces = ec.decodeArray(inp, ec.decodeString);
  this.structureDataTypes = ec.decodeArray(inp, decodeStructureDescription);
  this.enumDataTypes = ec.decodeArray(inp, decodeEnumDescription);
  this.simpleDataTypes = ec.decodeArray(inp, decodeSimpleTypeDescription);

 }


 clone( target?: DataTypeSchemaHeader): DataTypeSchemaHeader {
  if (!target) {
   target = new DataTypeSchemaHeader();
  }
  target.namespaces = ec.cloneArray(this.namespaces);
  if (this.structureDataTypes) { target.structureDataTypes = ec.cloneComplexArray(this.structureDataTypes); }
  if (this.enumDataTypes) { target.enumDataTypes = ec.cloneComplexArray(this.enumDataTypes); }
  if (this.simpleDataTypes) { target.simpleDataTypes = ec.cloneComplexArray(this.simpleDataTypes); }
  return target;
 }


}
export function decodeDataTypeSchemaHeader( inp: DataStream): DataTypeSchemaHeader {
  const obj = new DataTypeSchemaHeader();
   obj.decode(inp);
   return obj;

 }



