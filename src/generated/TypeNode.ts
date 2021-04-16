/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {DataStream} from '../basic-types';
import {Node} from '.';
import {INode} from '.';

export interface ITypeNode extends INode {
}

/**

*/

export class TypeNode extends Node {

 constructor( options?: ITypeNode) {
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


 clone( target?: TypeNode): TypeNode {
  if (!target) {
   target = new TypeNode();
  }
  super.clone(target);
  return target;
 }


}
export function decodeTypeNode( inp: DataStream): TypeNode {
  const obj = new TypeNode();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory';
import { ExpandedNodeId } from '../nodeid';
register_class_definition('TypeNode', TypeNode, new ExpandedNodeId(2 /*numeric id*/, 11890, 0));
