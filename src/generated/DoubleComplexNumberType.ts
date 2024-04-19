/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IDoubleComplexNumberType = Partial<DoubleComplexNumberType>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16248}
*/

export class DoubleComplexNumberType {
  real: ec.Double;
  imaginary: ec.Double;

 constructor( options?: IDoubleComplexNumberType | null) {
  options = options || {};
  this.real = (options.real != null) ? options.real : 0;
  this.imaginary = (options.imaginary != null) ? options.imaginary : 0;

 }


 encode( out: DataStream) {
  ec.encodeDouble(this.real, out);
  ec.encodeDouble(this.imaginary, out);

 }


 decode( inp: DataStream) {
  this.real = ec.decodeDouble(inp);
  this.imaginary = ec.decodeDouble(inp);

 }


 toJSON() {
  const out: any = {};
  out.Real = this.real;
  out.Imaginary = this.imaginary;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.real = inp.Real;
  this.imaginary = inp.Imaginary;

 }


 clone( target?: DoubleComplexNumberType): DoubleComplexNumberType {
  if (!target) {
   target = new DoubleComplexNumberType();
  }
  target.real = this.real;
  target.imaginary = this.imaginary;
  return target;
 }


}
export function decodeDoubleComplexNumberType( inp: DataStream): DoubleComplexNumberType {
  const obj = new DoubleComplexNumberType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('DoubleComplexNumberType', DoubleComplexNumberType, new ExpandedNodeId(2 /*numeric id*/, 12182, 0));
