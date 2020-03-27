/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {LocalizedText} from './LocalizedText';
import {DataStream} from '../basic-types/DataStream';
import {TypeNode} from './TypeNode';
import {ITypeNode} from './TypeNode';

export interface IReferenceTypeNode extends ITypeNode {
  isAbstract?: boolean;
  symmetric?: boolean;
  inverseName?: LocalizedText;
}

/**

*/

export class ReferenceTypeNode extends TypeNode {
  isAbstract: boolean;
  symmetric: boolean;
  inverseName: LocalizedText;

 constructor( options?: IReferenceTypeNode) {
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
  super.fromJSON(inp);
  this.isAbstract = inp.IsAbstract;
  this.symmetric = inp.Symmetric;
  this.inverseName.fromJSON(inp);

 }


 clone( target?: ReferenceTypeNode): ReferenceTypeNode {
  if (!target) {
   target = new ReferenceTypeNode();
  }
  super.clone(target);
  target.isAbstract = this.isAbstract;
  target.symmetric = this.symmetric;
  if (this.inverseName) { target.inverseName = this.inverseName.clone(); }
  return target;
 }


}
export function decodeReferenceTypeNode( inp: DataStream): ReferenceTypeNode {
  const obj = new ReferenceTypeNode();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ReferenceTypeNode', ReferenceTypeNode, new ExpandedNodeId(2 /*numeric id*/, 275, 0));
