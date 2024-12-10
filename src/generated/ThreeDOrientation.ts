/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {Orientation} from './Orientation';

export type IThreeDOrientation = Partial<ThreeDOrientation>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15531}
*/

export class ThreeDOrientation extends Orientation {
  a: ec.Double;
  b: ec.Double;
  c: ec.Double;

 constructor( options?: IThreeDOrientation | undefined) {
  options = options || {};
  super();
  this.a = (options.a != null) ? options.a : 0;
  this.b = (options.b != null) ? options.b : 0;
  this.c = (options.c != null) ? options.c : 0;

 }


 encode( out: DataStream) {
  ec.encodeDouble(this.a, out);
  ec.encodeDouble(this.b, out);
  ec.encodeDouble(this.c, out);

 }


 decode( inp: DataStream) {
  this.a = ec.decodeDouble(inp);
  this.b = ec.decodeDouble(inp);
  this.c = ec.decodeDouble(inp);

 }


 toJSON() {
  const out: any = {};
  out.A = this.a;
  out.B = this.b;
  out.C = this.c;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.a = inp.A;
  this.b = inp.B;
  this.c = inp.C;

 }


 clone( target?: ThreeDOrientation): ThreeDOrientation {
  if (!target) {
   target = new ThreeDOrientation();
  }
  target.a = this.a;
  target.b = this.b;
  target.c = this.c;
  return target;
 }


}
export function decodeThreeDOrientation( inp: DataStream): ThreeDOrientation {
  const obj = new ThreeDOrientation();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ThreeDOrientation', ThreeDOrientation, new ExpandedNodeId(2 /*numeric id*/, 18821, 0));
