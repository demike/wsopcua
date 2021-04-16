/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types';
import {NodeAttributes} from '.';
import {INodeAttributes} from '.';

export interface IViewAttributes extends INodeAttributes {
  containsNoLoops?: boolean;
  eventNotifier?: ec.Byte;
}

/**

*/

export class ViewAttributes extends NodeAttributes {
  containsNoLoops: boolean;
  eventNotifier: ec.Byte;

 constructor( options?: IViewAttributes) {
  options = options || {};
  super(options);
  this.containsNoLoops = (options.containsNoLoops != null) ? options.containsNoLoops : false;
  this.eventNotifier = (options.eventNotifier != null) ? options.eventNotifier : 0;

 }


 encode( out: DataStream) {
  super.encode(out);
  ec.encodeBoolean(this.containsNoLoops, out);
  ec.encodeByte(this.eventNotifier, out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.containsNoLoops = ec.decodeBoolean(inp);
  this.eventNotifier = ec.decodeByte(inp);

 }


 toJSON() {
  const out: any = super.toJSON();
  out.ContainsNoLoops = this.containsNoLoops;
  out.EventNotifier = this.eventNotifier;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  super.fromJSON(inp);
  this.containsNoLoops = inp.ContainsNoLoops;
  this.eventNotifier = inp.EventNotifier;

 }


 clone( target?: ViewAttributes): ViewAttributes {
  if (!target) {
   target = new ViewAttributes();
  }
  super.clone(target);
  target.containsNoLoops = this.containsNoLoops;
  target.eventNotifier = this.eventNotifier;
  return target;
 }


}
export function decodeViewAttributes( inp: DataStream): ViewAttributes {
  const obj = new ViewAttributes();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory';
import { ExpandedNodeId } from '../nodeid';
register_class_definition('ViewAttributes', ViewAttributes, new ExpandedNodeId(2 /*numeric id*/, 375, 0));
