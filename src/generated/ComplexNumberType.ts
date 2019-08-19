

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IComplexNumberType {
  real?: ec.Float;
  imaginary?: ec.Float;
}

/**

*/

export class ComplexNumberType {
  real: ec.Float;
  imaginary: ec.Float;

 constructor( options?: IComplexNumberType) {
  options = options || {};
  this.real = (options.real != null) ? options.real : null;
  this.imaginary = (options.imaginary != null) ? options.imaginary : null;

 }


 encode( out: DataStream) {
  ec.encodeFloat(this.real, out);
  ec.encodeFloat(this.imaginary, out);

 }


 decode( inp: DataStream) {
  this.real = ec.decodeFloat(inp);
  this.imaginary = ec.decodeFloat(inp);

 }


 clone( target?: ComplexNumberType): ComplexNumberType {
  if (!target) {
   target = new ComplexNumberType();
  }
  target.real = this.real;
  target.imaginary = this.imaginary;
  return target;
 }


}
export function decodeComplexNumberType( inp: DataStream): ComplexNumberType {
  const obj = new ComplexNumberType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ComplexNumberType', ComplexNumberType, makeExpandedNodeId(12181, 0));
