

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {NodeAttributes} from './NodeAttributes';
import {INodeAttributes} from './NodeAttributes';

export interface IObjectTypeAttributes extends INodeAttributes {
  isAbstract?: boolean;
}

/**
The attributes for an object type node.
*/

export class ObjectTypeAttributes extends NodeAttributes {
  isAbstract: boolean;

 constructor( options?: IObjectTypeAttributes) {
  options = options || {};
  super(options);
  this.isAbstract = (options.isAbstract) ? options.isAbstract : null;

 }


 encode( out: DataStream) {
  super.encode(out);
  ec.encodeBoolean(this.isAbstract, out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.isAbstract = ec.decodeBoolean(inp);

 }


 clone( target?: ObjectTypeAttributes): ObjectTypeAttributes {
  if (!target) {
   target = new ObjectTypeAttributes();
  }
  super.clone(target);
  target.isAbstract = this.isAbstract;
  return target;
 }


}
export function decodeObjectTypeAttributes( inp: DataStream): ObjectTypeAttributes {
  const obj = new ObjectTypeAttributes();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ObjectTypeAttributes', ObjectTypeAttributes, makeExpandedNodeId(363, 0));
