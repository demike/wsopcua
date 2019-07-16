

import * as ec from '../basic-types';
import {LocalizedText} from './LocalizedText';
import {DataStream} from '../basic-types/DataStream';
import {NodeAttributes} from './NodeAttributes';
import {INodeAttributes} from './NodeAttributes';

export interface IReferenceTypeAttributes extends INodeAttributes {
  isAbstract?: boolean;
  symmetric?: boolean;
  inverseName?: LocalizedText;
}

/**

*/

export class ReferenceTypeAttributes extends NodeAttributes {
  isAbstract: boolean;
  symmetric: boolean;
  inverseName: LocalizedText;

 constructor( options?: IReferenceTypeAttributes) {
  options = options || {};
  super(options);
  this.isAbstract = (options.isAbstract !== undefined) ? options.isAbstract : null;
  this.symmetric = (options.symmetric !== undefined) ? options.symmetric : null;
  this.inverseName = (options.inverseName !== undefined) ? options.inverseName : new LocalizedText();

 }


 encode( out: DataStream) {
  super.encode(out);
  ec.encodeBoolean(this.isAbstract, out);
  ec.encodeBoolean(this.symmetric, out);
  this.inverseName.encode(out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.isAbstract = ec.decodeBoolean(inp);
  this.symmetric = ec.decodeBoolean(inp);
  this.inverseName.decode(inp);

 }


 clone( target?: ReferenceTypeAttributes): ReferenceTypeAttributes {
  if (!target) {
   target = new ReferenceTypeAttributes();
  }
  super.clone(target);
  target.isAbstract = this.isAbstract;
  target.symmetric = this.symmetric;
  if (this.inverseName) { target.inverseName = this.inverseName.clone(); }
  return target;
 }


}
export function decodeReferenceTypeAttributes( inp: DataStream): ReferenceTypeAttributes {
  const obj = new ReferenceTypeAttributes();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ReferenceTypeAttributes', ReferenceTypeAttributes, makeExpandedNodeId(369, 0));
