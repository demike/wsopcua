/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IReferenceListEntryDataType = Partial<ReferenceListEntryDataType>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/2/17044}
*/

export class ReferenceListEntryDataType {
  referenceType: ec.NodeId;
  isForward: boolean;
  targetNode: ec.ExpandedNodeId;

 constructor( options?: IReferenceListEntryDataType | undefined) {
  options = options || {};
  this.referenceType = (options.referenceType != null) ? options.referenceType : ec.NodeId.NullNodeId;
  this.isForward = (options.isForward != null) ? options.isForward : false;
  this.targetNode = (options.targetNode != null) ? options.targetNode : ec.ExpandedNodeId.NullExpandedNodeId;

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.referenceType, out);
  ec.encodeBoolean(this.isForward, out);
  ec.encodeExpandedNodeId(this.targetNode, out);

 }


 decode( inp: DataStream) {
  this.referenceType = ec.decodeNodeId(inp);
  this.isForward = ec.decodeBoolean(inp);
  this.targetNode = ec.decodeExpandedNodeId(inp);

 }


 toJSON() {
  const out: any = {};
  out.ReferenceType = ec.jsonEncodeNodeId(this.referenceType);
  out.IsForward = this.isForward;
  out.TargetNode = ec.jsonEncodeExpandedNodeId(this.targetNode);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.referenceType = ec.jsonDecodeNodeId(inp.ReferenceType);
  this.isForward = inp.IsForward;
  this.targetNode = ec.jsonDecodeExpandedNodeId(inp.TargetNode);

 }


 clone( target?: ReferenceListEntryDataType): ReferenceListEntryDataType {
  if (!target) {
   target = new ReferenceListEntryDataType();
  }
  target.referenceType = this.referenceType;
  target.isForward = this.isForward;
  target.targetNode = this.targetNode;
  return target;
 }


}
export function decodeReferenceListEntryDataType( inp: DataStream): ReferenceListEntryDataType {
  const obj = new ReferenceListEntryDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ReferenceListEntryDataType', ReferenceListEntryDataType, new ExpandedNodeId(2 /*numeric id*/, 32662, 0));
