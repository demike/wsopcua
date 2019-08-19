

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IRationalNumber {
  numerator?: ec.Int32;
  denominator?: ec.UInt32;
}

/**

*/

export class RationalNumber {
  numerator: ec.Int32;
  denominator: ec.UInt32;

 constructor( options?: IRationalNumber) {
  options = options || {};
  this.numerator = (options.numerator !== undefined) ? options.numerator : null;
  this.denominator = (options.denominator !== undefined) ? options.denominator : null;

 }


 encode( out: DataStream) {
  ec.encodeInt32(this.numerator, out);
  ec.encodeUInt32(this.denominator, out);

 }


 decode( inp: DataStream) {
  this.numerator = ec.decodeInt32(inp);
  this.denominator = ec.decodeUInt32(inp);

 }


 clone( target?: RationalNumber): RationalNumber {
  if (!target) {
   target = new RationalNumber();
  }
  target.numerator = this.numerator;
  target.denominator = this.denominator;
  return target;
 }


}
export function decodeRationalNumber( inp: DataStream): RationalNumber {
  const obj = new RationalNumber();
   obj.decode(inp);
   return obj;

 }


