/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {NodeClass, encodeNodeClass, decodeNodeClass} from './NodeClass';
import {DataStream} from '../basic-types/DataStream';

export interface IAddReferencesItem {
  sourceNodeId?: ec.NodeId;
  referenceTypeId?: ec.NodeId;
  isForward?: boolean;
  targetServerUri?: string;
  targetNodeId?: ec.ExpandedNodeId;
  targetNodeClass?: NodeClass;
}

/**

*/

export class AddReferencesItem {
  sourceNodeId: ec.NodeId;
  referenceTypeId: ec.NodeId;
  isForward: boolean;
  targetServerUri: string | null;
  targetNodeId: ec.ExpandedNodeId;
  targetNodeClass: NodeClass;

 constructor( options?: IAddReferencesItem) {
  options = options || {};
  this.sourceNodeId = (options.sourceNodeId != null) ? options.sourceNodeId : ec.NodeId.NullNodeId;
  this.referenceTypeId = (options.referenceTypeId != null) ? options.referenceTypeId : ec.NodeId.NullNodeId;
  this.isForward = (options.isForward != null) ? options.isForward : false;
  this.targetServerUri = (options.targetServerUri != null) ? options.targetServerUri : null;
  this.targetNodeId = (options.targetNodeId != null) ? options.targetNodeId : ec.ExpandedNodeId.NullExpandedNodeId;
  this.targetNodeClass = (options.targetNodeClass != null) ? options.targetNodeClass : null;

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.sourceNodeId, out);
  ec.encodeNodeId(this.referenceTypeId, out);
  ec.encodeBoolean(this.isForward, out);
  ec.encodeString(this.targetServerUri, out);
  ec.encodeExpandedNodeId(this.targetNodeId, out);
  encodeNodeClass(this.targetNodeClass, out);

 }


 decode( inp: DataStream) {
  this.sourceNodeId = ec.decodeNodeId(inp);
  this.referenceTypeId = ec.decodeNodeId(inp);
  this.isForward = ec.decodeBoolean(inp);
  this.targetServerUri = ec.decodeString(inp);
  this.targetNodeId = ec.decodeExpandedNodeId(inp);
  this.targetNodeClass = decodeNodeClass(inp);

 }


 toJSON() {
  const out: any = {};
  out.SourceNodeId = ec.jsonEncodeNodeId(this.sourceNodeId);
  out.ReferenceTypeId = ec.jsonEncodeNodeId(this.referenceTypeId);
  out.IsForward = this.isForward;
  out.TargetServerUri = this.targetServerUri;
  out.TargetNodeId = ec.jsonEncodeExpandedNodeId(this.targetNodeId);
  out.TargetNodeClass = this.targetNodeClass;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.sourceNodeId = ec.jsonDecodeNodeId(inp.SourceNodeId);
  this.referenceTypeId = ec.jsonDecodeNodeId(inp.ReferenceTypeId);
  this.isForward = inp.IsForward;
  this.targetServerUri = inp.TargetServerUri;
  this.targetNodeId = ec.jsonDecodeExpandedNodeId(inp.TargetNodeId);
  this.targetNodeClass = inp.TargetNodeClass;

 }


 clone( target?: AddReferencesItem): AddReferencesItem {
  if (!target) {
   target = new AddReferencesItem();
  }
  target.sourceNodeId = this.sourceNodeId;
  target.referenceTypeId = this.referenceTypeId;
  target.isForward = this.isForward;
  target.targetServerUri = this.targetServerUri;
  target.targetNodeId = this.targetNodeId;
  target.targetNodeClass = this.targetNodeClass;
  return target;
 }


}
export function decodeAddReferencesItem( inp: DataStream): AddReferencesItem {
  const obj = new AddReferencesItem();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('AddReferencesItem', AddReferencesItem, new ExpandedNodeId(2 /*numeric id*/, 381, 0));
