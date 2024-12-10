/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IReferenceDescriptionDataType = Partial<ReferenceDescriptionDataType>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/2/17043}
*/

export class ReferenceDescriptionDataType {
  sourceNode: ec.NodeId;
  referenceType: ec.NodeId;
  isForward: boolean;
  targetNode: ec.ExpandedNodeId;

 constructor( options?: IReferenceDescriptionDataType | undefined) {
  options = options || {};
  this.sourceNode = (options.sourceNode != null) ? options.sourceNode : ec.NodeId.NullNodeId;
  this.referenceType = (options.referenceType != null) ? options.referenceType : ec.NodeId.NullNodeId;
  this.isForward = (options.isForward != null) ? options.isForward : false;
  this.targetNode = (options.targetNode != null) ? options.targetNode : ec.ExpandedNodeId.NullExpandedNodeId;

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.sourceNode, out);
  ec.encodeNodeId(this.referenceType, out);
  ec.encodeBoolean(this.isForward, out);
  ec.encodeExpandedNodeId(this.targetNode, out);

 }


 decode( inp: DataStream) {
  this.sourceNode = ec.decodeNodeId(inp);
  this.referenceType = ec.decodeNodeId(inp);
  this.isForward = ec.decodeBoolean(inp);
  this.targetNode = ec.decodeExpandedNodeId(inp);

 }


 toJSON() {
  const out: any = {};
  out.SourceNode = ec.jsonEncodeNodeId(this.sourceNode);
  out.ReferenceType = ec.jsonEncodeNodeId(this.referenceType);
  out.IsForward = this.isForward;
  out.TargetNode = ec.jsonEncodeExpandedNodeId(this.targetNode);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.sourceNode = ec.jsonDecodeNodeId(inp.SourceNode);
  this.referenceType = ec.jsonDecodeNodeId(inp.ReferenceType);
  this.isForward = inp.IsForward;
  this.targetNode = ec.jsonDecodeExpandedNodeId(inp.TargetNode);

 }


 clone( target?: ReferenceDescriptionDataType): ReferenceDescriptionDataType {
  if (!target) {
   target = new ReferenceDescriptionDataType();
  }
  target.sourceNode = this.sourceNode;
  target.referenceType = this.referenceType;
  target.isForward = this.isForward;
  target.targetNode = this.targetNode;
  return target;
 }


}
export function decodeReferenceDescriptionDataType( inp: DataStream): ReferenceDescriptionDataType {
  const obj = new ReferenceDescriptionDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ReferenceDescriptionDataType', ReferenceDescriptionDataType, new ExpandedNodeId(2 /*numeric id*/, 32661, 0));
