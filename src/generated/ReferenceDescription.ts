/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {QualifiedName} from './QualifiedName';
import {LocalizedText} from './LocalizedText';
import {NodeClass, encodeNodeClass, decodeNodeClass} from './NodeClass';
import {DataStream} from '../basic-types/DataStream';

export interface IReferenceDescription {
  referenceTypeId?: ec.NodeId;
  isForward?: boolean;
  nodeId?: ec.ExpandedNodeId;
  browseName?: QualifiedName;
  displayName?: LocalizedText;
  nodeClass?: NodeClass;
  typeDefinition?: ec.ExpandedNodeId;
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16100}
*/

export class ReferenceDescription {
  referenceTypeId: ec.NodeId;
  isForward: boolean;
  nodeId: ec.ExpandedNodeId;
  browseName: QualifiedName;
  displayName: LocalizedText;
  nodeClass: NodeClass;
  typeDefinition: ec.ExpandedNodeId;

 constructor( options?: IReferenceDescription) {
  options = options || {};
  this.referenceTypeId = (options.referenceTypeId != null) ? options.referenceTypeId : ec.NodeId.NullNodeId;
  this.isForward = (options.isForward != null) ? options.isForward : false;
  this.nodeId = (options.nodeId != null) ? options.nodeId : ec.ExpandedNodeId.NullExpandedNodeId;
  this.browseName = (options.browseName != null) ? options.browseName : new QualifiedName();
  this.displayName = (options.displayName != null) ? options.displayName : new LocalizedText();
  this.nodeClass = (options.nodeClass != null) ? options.nodeClass : null;
  this.typeDefinition = (options.typeDefinition != null) ? options.typeDefinition : ec.ExpandedNodeId.NullExpandedNodeId;

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.referenceTypeId, out);
  ec.encodeBoolean(this.isForward, out);
  ec.encodeExpandedNodeId(this.nodeId, out);
  this.browseName.encode(out);
  this.displayName.encode(out);
  encodeNodeClass(this.nodeClass, out);
  ec.encodeExpandedNodeId(this.typeDefinition, out);

 }


 decode( inp: DataStream) {
  this.referenceTypeId = ec.decodeNodeId(inp);
  this.isForward = ec.decodeBoolean(inp);
  this.nodeId = ec.decodeExpandedNodeId(inp);
  this.browseName.decode(inp);
  this.displayName.decode(inp);
  this.nodeClass = decodeNodeClass(inp);
  this.typeDefinition = ec.decodeExpandedNodeId(inp);

 }


 toJSON() {
  const out: any = {};
  out.ReferenceTypeId = ec.jsonEncodeNodeId(this.referenceTypeId);
  out.IsForward = this.isForward;
  out.NodeId = ec.jsonEncodeExpandedNodeId(this.nodeId);
  out.BrowseName = this.browseName;
  out.DisplayName = this.displayName;
  out.NodeClass = this.nodeClass;
  out.TypeDefinition = ec.jsonEncodeExpandedNodeId(this.typeDefinition);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.referenceTypeId = ec.jsonDecodeNodeId(inp.ReferenceTypeId);
  this.isForward = inp.IsForward;
  this.nodeId = ec.jsonDecodeExpandedNodeId(inp.NodeId);
  this.browseName.fromJSON(inp.BrowseName);
  this.displayName.fromJSON(inp.DisplayName);
  this.nodeClass = inp.NodeClass;
  this.typeDefinition = ec.jsonDecodeExpandedNodeId(inp.TypeDefinition);

 }


 clone( target?: ReferenceDescription): ReferenceDescription {
  if (!target) {
   target = new ReferenceDescription();
  }
  target.referenceTypeId = this.referenceTypeId;
  target.isForward = this.isForward;
  target.nodeId = this.nodeId;
  if (this.browseName) { target.browseName = this.browseName.clone(); }
  if (this.displayName) { target.displayName = this.displayName.clone(); }
  target.nodeClass = this.nodeClass;
  target.typeDefinition = this.typeDefinition;
  return target;
 }


}
export function decodeReferenceDescription( inp: DataStream): ReferenceDescription {
  const obj = new ReferenceDescription();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ReferenceDescription', ReferenceDescription, new ExpandedNodeId(2 /*numeric id*/, 520, 0));
