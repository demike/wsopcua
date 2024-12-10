/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {LocalizedText} from './LocalizedText';
import {DataStream} from '../basic-types/DataStream';
import {NodeAttributes} from './NodeAttributes';
import {INodeAttributes} from './NodeAttributes';

export type IReferenceTypeAttributes = Partial<ReferenceTypeAttributes>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16077}
*/

export class ReferenceTypeAttributes extends NodeAttributes {
  isAbstract: boolean;
  symmetric: boolean;
  inverseName: LocalizedText;

 constructor( options?: IReferenceTypeAttributes | undefined) {
  options = options || {};
  super(options);
  this.isAbstract = (options.isAbstract != null) ? options.isAbstract : false;
  this.symmetric = (options.symmetric != null) ? options.symmetric : false;
  this.inverseName = (options.inverseName != null) ? options.inverseName : new LocalizedText();

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


 toJSON() {
  const out: any = super.toJSON();
  out.IsAbstract = this.isAbstract;
  out.Symmetric = this.symmetric;
  out.InverseName = this.inverseName;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  super.fromJSON(inp);
  this.isAbstract = inp.IsAbstract;
  this.symmetric = inp.Symmetric;
  this.inverseName.fromJSON(inp.InverseName);

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
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ReferenceTypeAttributes', ReferenceTypeAttributes, new ExpandedNodeId(2 /*numeric id*/, 369, 0));
