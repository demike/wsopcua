/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IRationalNumber = Partial<RationalNumber>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15525}
*/

export class RationalNumber {
  numerator: ec.Int32;
  denominator: ec.UInt32;

 constructor( options?: IRationalNumber) {
  options = options || {};
  this.numerator = (options.numerator != null) ? options.numerator : 0;
  this.denominator = (options.denominator != null) ? options.denominator : 0;

 }


 encode( out: DataStream) {
  ec.encodeInt32(this.numerator, out);
  ec.encodeUInt32(this.denominator, out);

 }


 decode( inp: DataStream) {
  this.numerator = ec.decodeInt32(inp);
  this.denominator = ec.decodeUInt32(inp);

 }


 toJSON() {
  const out: any = {};
  out.Numerator = this.numerator;
  out.Denominator = this.denominator;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.numerator = inp.Numerator;
  this.denominator = inp.Denominator;

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



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('RationalNumber', RationalNumber, new ExpandedNodeId(2 /*numeric id*/, 18815, 0));
