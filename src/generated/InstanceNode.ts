/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {DataStream} from '../basic-types/DataStream';
import {Node} from './Node';
import {INode} from './Node';

export interface IInstanceNode extends INode {
}

/**

*/

export class InstanceNode extends Node {

 constructor( options?: IInstanceNode) {
  options = options || {};
  super(options);

 }


 encode( out: DataStream) {
  super.encode(out);

 }


 decode( inp: DataStream) {
  super.decode(inp);

 }


 toJSON() {
  const out: any = super.toJSON();
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  super.fromJSON(inp);

 }


 clone( target?: InstanceNode): InstanceNode {
  if (!target) {
   target = new InstanceNode();
  }
  super.clone(target);
  return target;
 }


}
export function decodeInstanceNode( inp: DataStream): InstanceNode {
  const obj = new InstanceNode();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('InstanceNode', InstanceNode, new ExpandedNodeId(2 /*numeric id*/, 11889, 0));
