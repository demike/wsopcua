/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {NodeAttributes} from './NodeAttributes';
import {INodeAttributes} from './NodeAttributes';

export type IObjectAttributes = Partial<ObjectAttributes>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16072}
*/

export class ObjectAttributes extends NodeAttributes {
  eventNotifier: ec.Byte;

 constructor( options?: IObjectAttributes | undefined) {
  options = options || {};
  super(options);
  this.eventNotifier = (options.eventNotifier != null) ? options.eventNotifier : 0;

 }


 encode( out: DataStream) {
  super.encode(out);
  ec.encodeByte(this.eventNotifier, out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.eventNotifier = ec.decodeByte(inp);

 }


 toJSON() {
  const out: any = super.toJSON();
  out.EventNotifier = this.eventNotifier;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  super.fromJSON(inp);
  this.eventNotifier = inp.EventNotifier;

 }


 clone( target?: ObjectAttributes): ObjectAttributes {
  if (!target) {
   target = new ObjectAttributes();
  }
  super.clone(target);
  target.eventNotifier = this.eventNotifier;
  return target;
 }


}
export function decodeObjectAttributes( inp: DataStream): ObjectAttributes {
  const obj = new ObjectAttributes();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ObjectAttributes', ObjectAttributes, new ExpandedNodeId(2 /*numeric id*/, 354, 0));
