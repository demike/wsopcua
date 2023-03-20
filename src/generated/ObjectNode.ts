/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {InstanceNode} from './InstanceNode';
import {IInstanceNode} from './InstanceNode';

export interface IObjectNode extends IInstanceNode {
  eventNotifier?: ec.Byte;
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15993}
*/

export class ObjectNode extends InstanceNode {
  eventNotifier: ec.Byte;

 constructor( options?: IObjectNode) {
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


 clone( target?: ObjectNode): ObjectNode {
  if (!target) {
   target = new ObjectNode();
  }
  super.clone(target);
  target.eventNotifier = this.eventNotifier;
  return target;
 }


}
export function decodeObjectNode( inp: DataStream): ObjectNode {
  const obj = new ObjectNode();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ObjectNode', ObjectNode, new ExpandedNodeId(2 /*numeric id*/, 261, 0));
