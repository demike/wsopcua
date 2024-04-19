/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type INodeReference = Partial<NodeReference>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16125}
*/

export class NodeReference {
  nodeId: ec.NodeId;
  referenceTypeId: ec.NodeId;
  isForward: boolean;
  referencedNodeIds: (ec.NodeId)[];

 constructor( options?: INodeReference | null) {
  options = options || {};
  this.nodeId = (options.nodeId != null) ? options.nodeId : ec.NodeId.NullNodeId;
  this.referenceTypeId = (options.referenceTypeId != null) ? options.referenceTypeId : ec.NodeId.NullNodeId;
  this.isForward = (options.isForward != null) ? options.isForward : false;
  this.referencedNodeIds = (options.referencedNodeIds != null) ? options.referencedNodeIds : [];

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.nodeId, out);
  ec.encodeNodeId(this.referenceTypeId, out);
  ec.encodeBoolean(this.isForward, out);
  ec.encodeArray(this.referencedNodeIds, out, ec.encodeNodeId);

 }


 decode( inp: DataStream) {
  this.nodeId = ec.decodeNodeId(inp);
  this.referenceTypeId = ec.decodeNodeId(inp);
  this.isForward = ec.decodeBoolean(inp);
  this.referencedNodeIds = ec.decodeArray(inp, ec.decodeNodeId) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.NodeId = ec.jsonEncodeNodeId(this.nodeId);
  out.ReferenceTypeId = ec.jsonEncodeNodeId(this.referenceTypeId);
  out.IsForward = this.isForward;
  out.ReferencedNodeIds = ec.jsonEncodeArray(this.referencedNodeIds, ec.jsonEncodeNodeId);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.nodeId = ec.jsonDecodeNodeId(inp.NodeId);
  this.referenceTypeId = ec.jsonDecodeNodeId(inp.ReferenceTypeId);
  this.isForward = inp.IsForward;
  this.referencedNodeIds = ec.jsonDecodeArray( inp.ReferencedNodeIds, ec.jsonDecodeNodeId);

 }


 clone( target?: NodeReference): NodeReference {
  if (!target) {
   target = new NodeReference();
  }
  target.nodeId = this.nodeId;
  target.referenceTypeId = this.referenceTypeId;
  target.isForward = this.isForward;
  target.referencedNodeIds = ec.cloneArray(this.referencedNodeIds);
  return target;
 }


}
export function decodeNodeReference( inp: DataStream): NodeReference {
  const obj = new NodeReference();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('NodeReference', NodeReference, new ExpandedNodeId(2 /*numeric id*/, 582, 0));
