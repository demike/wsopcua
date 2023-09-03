/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {FilterOperand} from './FilterOperand';

export interface IElementOperand {
  index?: ec.UInt32;
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16129}
*/

export class ElementOperand extends FilterOperand {
  index: ec.UInt32;

 constructor( options?: IElementOperand) {
  options = options || {};
  super();
  this.index = (options.index != null) ? options.index : 0;

 }


 encode( out: DataStream) {
  ec.encodeUInt32(this.index, out);

 }


 decode( inp: DataStream) {
  this.index = ec.decodeUInt32(inp);

 }


 toJSON() {
  const out: any = {};
  out.Index = this.index;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.index = inp.Index;

 }


 clone( target?: ElementOperand): ElementOperand {
  if (!target) {
   target = new ElementOperand();
  }
  target.index = this.index;
  return target;
 }


}
export function decodeElementOperand( inp: DataStream): ElementOperand {
  const obj = new ElementOperand();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ElementOperand', ElementOperand, new ExpandedNodeId(2 /*numeric id*/, 594, 0));
