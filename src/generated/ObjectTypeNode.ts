/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {TypeNode} from './TypeNode';
import {ITypeNode} from './TypeNode';

export interface IObjectTypeNode extends ITypeNode {
  isAbstract?: boolean;
}

/**

*/

export class ObjectTypeNode extends TypeNode {
  isAbstract: boolean;

 constructor( options?: IObjectTypeNode) {
  options = options || {};
  super(options);
  this.isAbstract = (options.isAbstract != null) ? options.isAbstract : false;

 }


 encode( out: DataStream) {
  super.encode(out);
  ec.encodeBoolean(this.isAbstract, out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.isAbstract = ec.decodeBoolean(inp);

 }


 clone( target?: ObjectTypeNode): ObjectTypeNode {
  if (!target) {
   target = new ObjectTypeNode();
  }
  super.clone(target);
  target.isAbstract = this.isAbstract;
  return target;
 }


}
export function decodeObjectTypeNode( inp: DataStream): ObjectTypeNode {
  const obj = new ObjectTypeNode();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ObjectTypeNode', ObjectTypeNode, new ExpandedNodeId(2 /*numeric id*/, 266, 0));
