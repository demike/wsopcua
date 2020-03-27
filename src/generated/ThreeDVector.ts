/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {Vector} from './Vector';

export interface IThreeDVector {
  x?: ec.Double;
  y?: ec.Double;
  z?: ec.Double;
}

/**

*/

export class ThreeDVector extends Vector {
  x: ec.Double;
  y: ec.Double;
  z: ec.Double;

 constructor( options?: IThreeDVector) {
  options = options || {};
  super();
  this.x = (options.x != null) ? options.x : 0;
  this.y = (options.y != null) ? options.y : 0;
  this.z = (options.z != null) ? options.z : 0;

 }


 encode( out: DataStream) {
  ec.encodeDouble(this.x, out);
  ec.encodeDouble(this.y, out);
  ec.encodeDouble(this.z, out);

 }


 decode( inp: DataStream) {
  this.x = ec.decodeDouble(inp);
  this.y = ec.decodeDouble(inp);
  this.z = ec.decodeDouble(inp);

 }


 toJSON() {
  const out: any = {};
  out.X = this.x;
  out.Y = this.y;
  out.Z = this.z;
 return out;
 }


 fromJSON( inp: any) {
  this.x = inp.X;
  this.y = inp.Y;
  this.z = inp.Z;

 }


 clone( target?: ThreeDVector): ThreeDVector {
  if (!target) {
   target = new ThreeDVector();
  }
  target.x = this.x;
  target.y = this.y;
  target.z = this.z;
  return target;
 }


}
export function decodeThreeDVector( inp: DataStream): ThreeDVector {
  const obj = new ThreeDVector();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ThreeDVector', ThreeDVector, new ExpandedNodeId(2 /*numeric id*/, 18817, 0));
