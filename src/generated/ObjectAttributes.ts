

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {NodeAttributes} from './NodeAttributes';
import {INodeAttributes} from './NodeAttributes';

export interface IObjectAttributes extends INodeAttributes {
  eventNotifier?: ec.Byte;
}

/**
The attributes for an object node.
*/

export class ObjectAttributes extends NodeAttributes {
  eventNotifier: ec.Byte;

 constructor( options?: IObjectAttributes) {
  options = options || {};
  super(options);
  this.eventNotifier = (options.eventNotifier) ? options.eventNotifier : null;

 }


 encode( out: DataStream) {
  super.encode(out);
  ec.encodeByte(this.eventNotifier, out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.eventNotifier = ec.decodeByte(inp);

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ObjectAttributes', ObjectAttributes, makeExpandedNodeId(354, 0));
