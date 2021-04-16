/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types';

export interface ISemanticChangeStructureDataType {
  affected?: ec.NodeId;
  affectedType?: ec.NodeId;
}

/**

*/

export class SemanticChangeStructureDataType {
  affected: ec.NodeId;
  affectedType: ec.NodeId;

 constructor( options?: ISemanticChangeStructureDataType) {
  options = options || {};
  this.affected = (options.affected != null) ? options.affected : ec.NodeId.NullNodeId;
  this.affectedType = (options.affectedType != null) ? options.affectedType : ec.NodeId.NullNodeId;

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.affected, out);
  ec.encodeNodeId(this.affectedType, out);

 }


 decode( inp: DataStream) {
  this.affected = ec.decodeNodeId(inp);
  this.affectedType = ec.decodeNodeId(inp);

 }


 toJSON() {
  const out: any = {};
  out.Affected = ec.jsonEncodeNodeId(this.affected);
  out.AffectedType = ec.jsonEncodeNodeId(this.affectedType);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.affected = ec.jsonDecodeNodeId(inp.Affected);
  this.affectedType = ec.jsonDecodeNodeId(inp.AffectedType);

 }


 clone( target?: SemanticChangeStructureDataType): SemanticChangeStructureDataType {
  if (!target) {
   target = new SemanticChangeStructureDataType();
  }
  target.affected = this.affected;
  target.affectedType = this.affectedType;
  return target;
 }


}
export function decodeSemanticChangeStructureDataType( inp: DataStream): SemanticChangeStructureDataType {
  const obj = new SemanticChangeStructureDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory';
import { ExpandedNodeId } from '../nodeid';
register_class_definition('SemanticChangeStructureDataType', SemanticChangeStructureDataType, new ExpandedNodeId(2 /*numeric id*/, 899, 0));
