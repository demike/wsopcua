/** generated by wsopcua data type generator 
 do not modify, changes will be overwritten 
 */

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {Node} from './Node';
import {INode} from './Node';

export interface ITypeNode extends INode {
  noOfRolePermissions?: ec.Int32;
  noOfUserRolePermissions?: ec.Int32;
  noOfReferences?: ec.Int32;
}

/**

*/

export class TypeNode extends Node {
  noOfRolePermissions: ec.Int32;
  noOfUserRolePermissions: ec.Int32;
  noOfReferences: ec.Int32;

 constructor( options?: ITypeNode) {
  options = options || {};
  super(options);
  this.noOfRolePermissions = (options.noOfRolePermissions != null) ? options.noOfRolePermissions : 0;
  this.noOfUserRolePermissions = (options.noOfUserRolePermissions != null) ? options.noOfUserRolePermissions : 0;
  this.noOfReferences = (options.noOfReferences != null) ? options.noOfReferences : 0;

 }


 encode( out: DataStream) {
  super.encode(out);
  ec.encodeInt32(this.noOfRolePermissions, out);
  ec.encodeInt32(this.noOfUserRolePermissions, out);
  ec.encodeInt32(this.noOfReferences, out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.noOfRolePermissions = ec.decodeInt32(inp);
  this.noOfUserRolePermissions = ec.decodeInt32(inp);
  this.noOfReferences = ec.decodeInt32(inp);

 }


 clone( target?: TypeNode): TypeNode {
  if (!target) {
   target = new TypeNode();
  }
  super.clone(target);
  target.noOfRolePermissions = this.noOfRolePermissions;
  target.noOfUserRolePermissions = this.noOfUserRolePermissions;
  target.noOfReferences = this.noOfReferences;
  return target;
 }


}
export function decodeTypeNode( inp: DataStream): TypeNode {
  const obj = new TypeNode();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('TypeNode', TypeNode, makeExpandedNodeId(11890, 0));
