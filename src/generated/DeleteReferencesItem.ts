

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IDeleteReferencesItem {
  sourceNodeId?: ec.NodeId;
  referenceTypeId?: ec.NodeId;
  isForward?: boolean;
  targetNodeId?: ec.ExpandedNodeId;
  deleteBidirectional?: boolean;
}

/**

*/

export class DeleteReferencesItem {
  sourceNodeId: ec.NodeId;
  referenceTypeId: ec.NodeId;
  isForward: boolean;
  targetNodeId: ec.ExpandedNodeId;
  deleteBidirectional: boolean;

 constructor( options?: IDeleteReferencesItem) {
  options = options || {};
  this.sourceNodeId = (options.sourceNodeId !== undefined) ? options.sourceNodeId : null;
  this.referenceTypeId = (options.referenceTypeId !== undefined) ? options.referenceTypeId : null;
  this.isForward = (options.isForward !== undefined) ? options.isForward : null;
  this.targetNodeId = (options.targetNodeId !== undefined) ? options.targetNodeId : null;
  this.deleteBidirectional = (options.deleteBidirectional !== undefined) ? options.deleteBidirectional : null;

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.sourceNodeId, out);
  ec.encodeNodeId(this.referenceTypeId, out);
  ec.encodeBoolean(this.isForward, out);
  ec.encodeExpandedNodeId(this.targetNodeId, out);
  ec.encodeBoolean(this.deleteBidirectional, out);

 }


 decode( inp: DataStream) {
  this.sourceNodeId = ec.decodeNodeId(inp);
  this.referenceTypeId = ec.decodeNodeId(inp);
  this.isForward = ec.decodeBoolean(inp);
  this.targetNodeId = ec.decodeExpandedNodeId(inp);
  this.deleteBidirectional = ec.decodeBoolean(inp);

 }


 clone( target?: DeleteReferencesItem): DeleteReferencesItem {
  if (!target) {
   target = new DeleteReferencesItem();
  }
  target.sourceNodeId = this.sourceNodeId;
  target.referenceTypeId = this.referenceTypeId;
  target.isForward = this.isForward;
  target.targetNodeId = this.targetNodeId;
  target.deleteBidirectional = this.deleteBidirectional;
  return target;
 }


}
export function decodeDeleteReferencesItem( inp: DataStream): DeleteReferencesItem {
  const obj = new DeleteReferencesItem();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('DeleteReferencesItem', DeleteReferencesItem, makeExpandedNodeId(387, 0));
