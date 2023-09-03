/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IModelChangeStructureDataType {
  affected?: ec.NodeId;
  affectedType?: ec.NodeId;
  verb?: ec.Byte;
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16242}
*/

export class ModelChangeStructureDataType {
  affected: ec.NodeId;
  affectedType: ec.NodeId;
  verb: ec.Byte;

 constructor( options?: IModelChangeStructureDataType) {
  options = options || {};
  this.affected = (options.affected != null) ? options.affected : ec.NodeId.NullNodeId;
  this.affectedType = (options.affectedType != null) ? options.affectedType : ec.NodeId.NullNodeId;
  this.verb = (options.verb != null) ? options.verb : 0;

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.affected, out);
  ec.encodeNodeId(this.affectedType, out);
  ec.encodeByte(this.verb, out);

 }


 decode( inp: DataStream) {
  this.affected = ec.decodeNodeId(inp);
  this.affectedType = ec.decodeNodeId(inp);
  this.verb = ec.decodeByte(inp);

 }


 toJSON() {
  const out: any = {};
  out.Affected = ec.jsonEncodeNodeId(this.affected);
  out.AffectedType = ec.jsonEncodeNodeId(this.affectedType);
  out.Verb = this.verb;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.affected = ec.jsonDecodeNodeId(inp.Affected);
  this.affectedType = ec.jsonDecodeNodeId(inp.AffectedType);
  this.verb = inp.Verb;

 }


 clone( target?: ModelChangeStructureDataType): ModelChangeStructureDataType {
  if (!target) {
   target = new ModelChangeStructureDataType();
  }
  target.affected = this.affected;
  target.affectedType = this.affectedType;
  target.verb = this.verb;
  return target;
 }


}
export function decodeModelChangeStructureDataType( inp: DataStream): ModelChangeStructureDataType {
  const obj = new ModelChangeStructureDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ModelChangeStructureDataType', ModelChangeStructureDataType, new ExpandedNodeId(2 /*numeric id*/, 879, 0));
