/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IDeleteNodesItem {
  nodeId?: ec.NodeId;
  deleteTargetReferences?: boolean;
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16089}
*/

export class DeleteNodesItem {
  nodeId: ec.NodeId;
  deleteTargetReferences: boolean;

 constructor( options?: IDeleteNodesItem) {
  options = options || {};
  this.nodeId = (options.nodeId != null) ? options.nodeId : ec.NodeId.NullNodeId;
  this.deleteTargetReferences = (options.deleteTargetReferences != null) ? options.deleteTargetReferences : false;

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.nodeId, out);
  ec.encodeBoolean(this.deleteTargetReferences, out);

 }


 decode( inp: DataStream) {
  this.nodeId = ec.decodeNodeId(inp);
  this.deleteTargetReferences = ec.decodeBoolean(inp);

 }


 toJSON() {
  const out: any = {};
  out.NodeId = ec.jsonEncodeNodeId(this.nodeId);
  out.DeleteTargetReferences = this.deleteTargetReferences;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.nodeId = ec.jsonDecodeNodeId(inp.NodeId);
  this.deleteTargetReferences = inp.DeleteTargetReferences;

 }


 clone( target?: DeleteNodesItem): DeleteNodesItem {
  if (!target) {
   target = new DeleteNodesItem();
  }
  target.nodeId = this.nodeId;
  target.deleteTargetReferences = this.deleteTargetReferences;
  return target;
 }


}
export function decodeDeleteNodesItem( inp: DataStream): DeleteNodesItem {
  const obj = new DeleteNodesItem();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('DeleteNodesItem', DeleteNodesItem, new ExpandedNodeId(2 /*numeric id*/, 382, 0));
