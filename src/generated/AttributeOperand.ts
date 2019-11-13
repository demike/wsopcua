/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {RelativePath} from './RelativePath';
import {DataStream} from '../basic-types/DataStream';
import {FilterOperand} from './FilterOperand';

export interface IAttributeOperand {
  nodeId?: ec.NodeId;
  alias?: string;
  browsePath?: RelativePath;
  attributeId?: ec.UInt32;
  indexRange?: string;
}

/**

*/

export class AttributeOperand extends FilterOperand {
  nodeId: ec.NodeId;
  alias: string | null;
  browsePath: RelativePath;
  attributeId: ec.UInt32;
  indexRange: string | null;

 constructor( options?: IAttributeOperand) {
  options = options || {};
  super();
  this.nodeId = (options.nodeId != null) ? options.nodeId : ec.NodeId.NullNodeId;
  this.alias = (options.alias != null) ? options.alias : null;
  this.browsePath = (options.browsePath != null) ? options.browsePath : new RelativePath();
  this.attributeId = (options.attributeId != null) ? options.attributeId : 0;
  this.indexRange = (options.indexRange != null) ? options.indexRange : null;

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.nodeId, out);
  ec.encodeString(this.alias, out);
  this.browsePath.encode(out);
  ec.encodeUInt32(this.attributeId, out);
  ec.encodeString(this.indexRange, out);

 }


 decode( inp: DataStream) {
  this.nodeId = ec.decodeNodeId(inp);
  this.alias = ec.decodeString(inp);
  this.browsePath.decode(inp);
  this.attributeId = ec.decodeUInt32(inp);
  this.indexRange = ec.decodeString(inp);

 }


 clone( target?: AttributeOperand): AttributeOperand {
  if (!target) {
   target = new AttributeOperand();
  }
  target.nodeId = this.nodeId;
  target.alias = this.alias;
  if (this.browsePath) { target.browsePath = this.browsePath.clone(); }
  target.attributeId = this.attributeId;
  target.indexRange = this.indexRange;
  return target;
 }


}
export function decodeAttributeOperand( inp: DataStream): AttributeOperand {
  const obj = new AttributeOperand();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('AttributeOperand', AttributeOperand, new ExpandedNodeId(2 /*numeric id*/, 600, 0));
