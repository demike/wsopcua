/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {QualifiedName} from './QualifiedName';
import {NodeClass, encodeNodeClass, decodeNodeClass} from './NodeClass';
import {ExtensionObject, encodeExtensionObject, decodeExtensionObject, jsonEncodeExtensionObject, jsonDecodeExtensionObject} from '../basic-types/extension_object';
import {DataStream} from '../basic-types/DataStream';

export type IAddNodesItem = Partial<AddNodesItem>;

/**

*/

export class AddNodesItem {
  parentNodeId: ec.ExpandedNodeId;
  referenceTypeId: ec.NodeId;
  requestedNewNodeId: ec.ExpandedNodeId;
  browseName: QualifiedName;
  nodeClass: NodeClass;
  nodeAttributes: ExtensionObject | null;
  typeDefinition: ec.ExpandedNodeId;

 constructor( options?: IAddNodesItem | null) {
  options = options || {};
  this.parentNodeId = (options.parentNodeId != null) ? options.parentNodeId : ec.ExpandedNodeId.NullExpandedNodeId;
  this.referenceTypeId = (options.referenceTypeId != null) ? options.referenceTypeId : ec.NodeId.NullNodeId;
  this.requestedNewNodeId = (options.requestedNewNodeId != null) ? options.requestedNewNodeId : ec.ExpandedNodeId.NullExpandedNodeId;
  this.browseName = (options.browseName != null) ? options.browseName : new QualifiedName();
  this.nodeClass = (options.nodeClass != null) ? options.nodeClass : NodeClass.Invalid;
  this.nodeAttributes = (options.nodeAttributes != null) ? options.nodeAttributes : null;
  this.typeDefinition = (options.typeDefinition != null) ? options.typeDefinition : ec.ExpandedNodeId.NullExpandedNodeId;

 }


 encode( out: DataStream) {
  ec.encodeExpandedNodeId(this.parentNodeId, out);
  ec.encodeNodeId(this.referenceTypeId, out);
  ec.encodeExpandedNodeId(this.requestedNewNodeId, out);
  this.browseName.encode(out);
  encodeNodeClass(this.nodeClass, out);
  encodeExtensionObject(this.nodeAttributes, out);
  ec.encodeExpandedNodeId(this.typeDefinition, out);

 }


 decode( inp: DataStream) {
  this.parentNodeId = ec.decodeExpandedNodeId(inp);
  this.referenceTypeId = ec.decodeNodeId(inp);
  this.requestedNewNodeId = ec.decodeExpandedNodeId(inp);
  this.browseName.decode(inp);
  this.nodeClass = decodeNodeClass(inp);
  this.nodeAttributes = decodeExtensionObject(inp);
  this.typeDefinition = ec.decodeExpandedNodeId(inp);

 }


 toJSON() {
  const out: any = {};
  out.ParentNodeId = ec.jsonEncodeExpandedNodeId(this.parentNodeId);
  out.ReferenceTypeId = ec.jsonEncodeNodeId(this.referenceTypeId);
  out.RequestedNewNodeId = ec.jsonEncodeExpandedNodeId(this.requestedNewNodeId);
  out.BrowseName = this.browseName;
  out.NodeClass = this.nodeClass;
  out.NodeAttributes = jsonEncodeExtensionObject(this.nodeAttributes);
  out.TypeDefinition = ec.jsonEncodeExpandedNodeId(this.typeDefinition);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.parentNodeId = ec.jsonDecodeExpandedNodeId(inp.ParentNodeId);
  this.referenceTypeId = ec.jsonDecodeNodeId(inp.ReferenceTypeId);
  this.requestedNewNodeId = ec.jsonDecodeExpandedNodeId(inp.RequestedNewNodeId);
  this.browseName.fromJSON(inp.BrowseName);
  this.nodeClass = inp.NodeClass;
  this.nodeAttributes = jsonDecodeExtensionObject(inp.NodeAttributes);
  this.typeDefinition = ec.jsonDecodeExpandedNodeId(inp.TypeDefinition);

 }


 clone( target?: AddNodesItem): AddNodesItem {
  if (!target) {
   target = new AddNodesItem();
  }
  target.parentNodeId = this.parentNodeId;
  target.referenceTypeId = this.referenceTypeId;
  target.requestedNewNodeId = this.requestedNewNodeId;
  if (this.browseName) { target.browseName = this.browseName.clone(); }
  target.nodeClass = this.nodeClass;
  target.nodeAttributes = this.nodeAttributes;
  target.typeDefinition = this.typeDefinition;
  return target;
 }


}
export function decodeAddNodesItem( inp: DataStream): AddNodesItem {
  const obj = new AddNodesItem();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('AddNodesItem', AddNodesItem, new ExpandedNodeId(2 /*numeric id*/, 378, 0));
