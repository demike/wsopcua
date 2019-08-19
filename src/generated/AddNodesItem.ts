

import * as ec from '../basic-types';
import {QualifiedName} from './QualifiedName';
import {NodeClass, encodeNodeClass, decodeNodeClass} from './NodeClass';
import {ExtensionObject, encodeExtensionObject, decodeExtensionObject} from '../basic-types/extension_object';
import {DataStream} from '../basic-types/DataStream';

export interface IAddNodesItem {
  parentNodeId?: ec.ExpandedNodeId;
  referenceTypeId?: ec.NodeId;
  requestedNewNodeId?: ec.ExpandedNodeId;
  browseName?: QualifiedName;
  nodeClass?: NodeClass;
  nodeAttributes?: ExtensionObject;
  typeDefinition?: ec.ExpandedNodeId;
}

/**

*/

export class AddNodesItem {
  parentNodeId: ec.ExpandedNodeId;
  referenceTypeId: ec.NodeId;
  requestedNewNodeId: ec.ExpandedNodeId;
  browseName: QualifiedName;
  nodeClass: NodeClass;
  nodeAttributes: ExtensionObject;
  typeDefinition: ec.ExpandedNodeId;

 constructor( options?: IAddNodesItem) {
  options = options || {};
  this.parentNodeId = (options.parentNodeId != null) ? options.parentNodeId : null;
  this.referenceTypeId = (options.referenceTypeId != null) ? options.referenceTypeId : null;
  this.requestedNewNodeId = (options.requestedNewNodeId != null) ? options.requestedNewNodeId : null;
  this.browseName = (options.browseName != null) ? options.browseName : new QualifiedName();
  this.nodeClass = (options.nodeClass != null) ? options.nodeClass : null;
  this.nodeAttributes = (options.nodeAttributes != null) ? options.nodeAttributes : null;
  this.typeDefinition = (options.typeDefinition != null) ? options.typeDefinition : null;

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('AddNodesItem', AddNodesItem, makeExpandedNodeId(378, 0));
