/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

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
  this.namespaces = (options.namespaces != null) ? options.namespaces : [];
  this.structureDataTypes = (options.structureDataTypes != null) ? options.structureDataTypes : [];
  this.enumDataTypes = (options.enumDataTypes != null) ? options.enumDataTypes : [];
  this.simpleDataTypes = (options.simpleDataTypes != null) ? options.simpleDataTypes : [];

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


 toJSON() {
  const out: any = {};
  out.Namespaces = this.namespaces;
  out.StructureDataTypes = this.structureDataTypes;
  out.EnumDataTypes = this.enumDataTypes;
  out.SimpleDataTypes = this.simpleDataTypes;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.namespaces = inp.Namespaces;
  this.structureDataTypes = ec.jsonDecodeStructArray( inp.StructureDataTypes, StructureDescription);
  this.enumDataTypes = ec.jsonDecodeStructArray( inp.EnumDataTypes, EnumDescription);
  this.simpleDataTypes = ec.jsonDecodeStructArray( inp.SimpleDataTypes, SimpleTypeDescription);

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



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('DataTypeSchemaHeader', DataTypeSchemaHeader, new ExpandedNodeId(2 /*numeric id*/, 15676, 0));
