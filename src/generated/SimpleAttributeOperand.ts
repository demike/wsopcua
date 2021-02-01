/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {QualifiedName} from './QualifiedName';
import {decodeQualifiedName} from './QualifiedName';
import {DataStream} from '../basic-types/DataStream';
import {FilterOperand} from './FilterOperand';

export interface ISimpleAttributeOperand {
  typeDefinitionId?: ec.NodeId;
  browsePath?: QualifiedName[];
  attributeId?: ec.UInt32;
  indexRange?: string;
}

/**

*/

export class SimpleAttributeOperand extends FilterOperand {
  typeDefinitionId: ec.NodeId;
  browsePath: QualifiedName[];
  attributeId: ec.UInt32;
  indexRange: string | null;

 constructor( options?: ISimpleAttributeOperand) {
  options = options || {};
  super();
  this.typeDefinitionId = (options.typeDefinitionId != null) ? options.typeDefinitionId : ec.NodeId.NullNodeId;
  this.browsePath = (options.browsePath != null) ? options.browsePath : [];
  this.attributeId = (options.attributeId != null) ? options.attributeId : 0;
  this.indexRange = (options.indexRange != null) ? options.indexRange : null;

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.typeDefinitionId, out);
  ec.encodeArray(this.browsePath, out);
  ec.encodeUInt32(this.attributeId, out);
  ec.encodeString(this.indexRange, out);

 }


 decode( inp: DataStream) {
  this.typeDefinitionId = ec.decodeNodeId(inp);
  this.browsePath = ec.decodeArray(inp, decodeQualifiedName);
  this.attributeId = ec.decodeUInt32(inp);
  this.indexRange = ec.decodeString(inp);

 }


 toJSON() {
  const out: any = {};
  out.TypeDefinitionId = ec.jsonEncodeNodeId(this.typeDefinitionId);
  out.BrowsePath = this.browsePath;
  out.AttributeId = this.attributeId;
  out.IndexRange = this.indexRange;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.typeDefinitionId = ec.jsonDecodeNodeId(inp.TypeDefinitionId);
  this.browsePath = ec.jsonDecodeStructArray( inp.BrowsePath, QualifiedName);
  this.attributeId = inp.AttributeId;
  this.indexRange = inp.IndexRange;

 }


 clone( target?: SimpleAttributeOperand): SimpleAttributeOperand {
  if (!target) {
   target = new SimpleAttributeOperand();
  }
  target.typeDefinitionId = this.typeDefinitionId;
  if (this.browsePath) { target.browsePath = ec.cloneComplexArray(this.browsePath); }
  target.attributeId = this.attributeId;
  target.indexRange = this.indexRange;
  return target;
 }


}
export function decodeSimpleAttributeOperand( inp: DataStream): SimpleAttributeOperand {
  const obj = new SimpleAttributeOperand();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('SimpleAttributeOperand', SimpleAttributeOperand, new ExpandedNodeId(2 /*numeric id*/, 603, 0));
