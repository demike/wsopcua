/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {StructureType, encodeStructureType, decodeStructureType} from './StructureType';
import {StructureField} from './StructureField';
import {decodeStructureField} from './StructureField';
import {DataStream} from '../basic-types/DataStream';
import {DataTypeDefinition} from './DataTypeDefinition';

export interface IStructureDefinition {
  defaultEncodingId?: ec.NodeId;
  baseDataType?: ec.NodeId;
  structureType?: StructureType;
  fields?: StructureField[];
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15988}
*/

export class StructureDefinition extends DataTypeDefinition {
  defaultEncodingId: ec.NodeId;
  baseDataType: ec.NodeId;
  structureType: StructureType;
  fields: StructureField[];

 constructor( options?: IStructureDefinition) {
  options = options || {};
  super();
  this.defaultEncodingId = (options.defaultEncodingId != null) ? options.defaultEncodingId : ec.NodeId.NullNodeId;
  this.baseDataType = (options.baseDataType != null) ? options.baseDataType : ec.NodeId.NullNodeId;
  this.structureType = (options.structureType != null) ? options.structureType : null;
  this.fields = (options.fields != null) ? options.fields : [];

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.defaultEncodingId, out);
  ec.encodeNodeId(this.baseDataType, out);
  encodeStructureType(this.structureType, out);
  ec.encodeArray(this.fields, out);

 }


 decode( inp: DataStream) {
  this.defaultEncodingId = ec.decodeNodeId(inp);
  this.baseDataType = ec.decodeNodeId(inp);
  this.structureType = decodeStructureType(inp);
  this.fields = ec.decodeArray(inp, decodeStructureField) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.DefaultEncodingId = ec.jsonEncodeNodeId(this.defaultEncodingId);
  out.BaseDataType = ec.jsonEncodeNodeId(this.baseDataType);
  out.StructureType = this.structureType;
  out.Fields = this.fields;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.defaultEncodingId = ec.jsonDecodeNodeId(inp.DefaultEncodingId);
  this.baseDataType = ec.jsonDecodeNodeId(inp.BaseDataType);
  this.structureType = inp.StructureType;
  this.fields = ec.jsonDecodeStructArray( inp.Fields,StructureField);

 }


 clone( target?: StructureDefinition): StructureDefinition {
  if (!target) {
   target = new StructureDefinition();
  }
  target.defaultEncodingId = this.defaultEncodingId;
  target.baseDataType = this.baseDataType;
  target.structureType = this.structureType;
  if (this.fields) { target.fields = ec.cloneComplexArray(this.fields); }
  return target;
 }


}
export function decodeStructureDefinition( inp: DataStream): StructureDefinition {
  const obj = new StructureDefinition();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('StructureDefinition', StructureDefinition, new ExpandedNodeId(2 /*numeric id*/, 122, 0));
