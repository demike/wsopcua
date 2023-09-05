/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {LocalizedText} from './LocalizedText';
import {DataStream} from '../basic-types/DataStream';

export type INodeAttributes = Partial<NodeAttributes>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16071}
*/

export class NodeAttributes {
  specifiedAttributes: ec.UInt32;
  displayName: LocalizedText;
  description: LocalizedText;
  writeMask: ec.UInt32;
  userWriteMask: ec.UInt32;

 constructor( options?: INodeAttributes) {
  options = options || {};
  this.specifiedAttributes = (options.specifiedAttributes != null) ? options.specifiedAttributes : 0;
  this.displayName = (options.displayName != null) ? options.displayName : new LocalizedText();
  this.description = (options.description != null) ? options.description : new LocalizedText();
  this.writeMask = (options.writeMask != null) ? options.writeMask : 0;
  this.userWriteMask = (options.userWriteMask != null) ? options.userWriteMask : 0;

 }


 encode( out: DataStream) {
  ec.encodeUInt32(this.specifiedAttributes, out);
  this.displayName.encode(out);
  this.description.encode(out);
  ec.encodeUInt32(this.writeMask, out);
  ec.encodeUInt32(this.userWriteMask, out);

 }


 decode( inp: DataStream) {
  this.specifiedAttributes = ec.decodeUInt32(inp);
  this.displayName.decode(inp);
  this.description.decode(inp);
  this.writeMask = ec.decodeUInt32(inp);
  this.userWriteMask = ec.decodeUInt32(inp);

 }


 toJSON() {
  const out: any = {};
  out.SpecifiedAttributes = this.specifiedAttributes;
  out.DisplayName = this.displayName;
  out.Description = this.description;
  out.WriteMask = this.writeMask;
  out.UserWriteMask = this.userWriteMask;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.specifiedAttributes = inp.SpecifiedAttributes;
  this.displayName.fromJSON(inp.DisplayName);
  this.description.fromJSON(inp.Description);
  this.writeMask = inp.WriteMask;
  this.userWriteMask = inp.UserWriteMask;

 }


 clone( target?: NodeAttributes): NodeAttributes {
  if (!target) {
   target = new NodeAttributes();
  }
  target.specifiedAttributes = this.specifiedAttributes;
  if (this.displayName) { target.displayName = this.displayName.clone(); }
  if (this.description) { target.description = this.description.clone(); }
  target.writeMask = this.writeMask;
  target.userWriteMask = this.userWriteMask;
  return target;
 }


}
export function decodeNodeAttributes( inp: DataStream): NodeAttributes {
  const obj = new NodeAttributes();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('NodeAttributes', NodeAttributes, new ExpandedNodeId(2 /*numeric id*/, 351, 0));
