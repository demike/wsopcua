/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IReferenceNode {
  referenceTypeId?: ec.NodeId;
  isInverse?: boolean;
  targetId?: ec.ExpandedNodeId;
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16001}
*/

export class ReferenceNode {
  referenceTypeId: ec.NodeId;
  isInverse: boolean;
  targetId: ec.ExpandedNodeId;

 constructor( options?: IReferenceNode) {
  options = options || {};
  this.referenceTypeId = (options.referenceTypeId != null) ? options.referenceTypeId : ec.NodeId.NullNodeId;
  this.isInverse = (options.isInverse != null) ? options.isInverse : false;
  this.targetId = (options.targetId != null) ? options.targetId : ec.ExpandedNodeId.NullExpandedNodeId;

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.referenceTypeId, out);
  ec.encodeBoolean(this.isInverse, out);
  ec.encodeExpandedNodeId(this.targetId, out);

 }


 decode( inp: DataStream) {
  this.referenceTypeId = ec.decodeNodeId(inp);
  this.isInverse = ec.decodeBoolean(inp);
  this.targetId = ec.decodeExpandedNodeId(inp);

 }


 toJSON() {
  const out: any = {};
  out.ReferenceTypeId = ec.jsonEncodeNodeId(this.referenceTypeId);
  out.IsInverse = this.isInverse;
  out.TargetId = ec.jsonEncodeExpandedNodeId(this.targetId);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.referenceTypeId = ec.jsonDecodeNodeId(inp.ReferenceTypeId);
  this.isInverse = inp.IsInverse;
  this.targetId = ec.jsonDecodeExpandedNodeId(inp.TargetId);

 }


 clone( target?: ReferenceNode): ReferenceNode {
  if (!target) {
   target = new ReferenceNode();
  }
  target.referenceTypeId = this.referenceTypeId;
  target.isInverse = this.isInverse;
  target.targetId = this.targetId;
  return target;
 }


}
export function decodeReferenceNode( inp: DataStream): ReferenceNode {
  const obj = new ReferenceNode();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ReferenceNode', ReferenceNode, new ExpandedNodeId(2 /*numeric id*/, 285, 0));
