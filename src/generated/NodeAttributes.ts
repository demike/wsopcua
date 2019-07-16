

import * as ec from '../basic-types';
import {LocalizedText} from './LocalizedText';
import {DataStream} from '../basic-types/DataStream';

export interface INodeAttributes {
  specifiedAttributes?: ec.UInt32;
  displayName?: LocalizedText;
  description?: LocalizedText;
  writeMask?: ec.UInt32;
  userWriteMask?: ec.UInt32;
}

/**

*/

export class NodeAttributes {
  specifiedAttributes: ec.UInt32;
  displayName: LocalizedText;
  description: LocalizedText;
  writeMask: ec.UInt32;
  userWriteMask: ec.UInt32;

 constructor( options?: INodeAttributes) {
  options = options || {};
  this.specifiedAttributes = (options.specifiedAttributes !== undefined) ? options.specifiedAttributes : null;
  this.displayName = (options.displayName !== undefined) ? options.displayName : new LocalizedText();
  this.description = (options.description !== undefined) ? options.description : new LocalizedText();
  this.writeMask = (options.writeMask !== undefined) ? options.writeMask : null;
  this.userWriteMask = (options.userWriteMask !== undefined) ? options.userWriteMask : null;

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('NodeAttributes', NodeAttributes, makeExpandedNodeId(351, 0));
