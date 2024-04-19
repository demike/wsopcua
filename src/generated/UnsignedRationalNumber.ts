/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IUnsignedRationalNumber = Partial<UnsignedRationalNumber>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15969}
*/

export class UnsignedRationalNumber {
  numerator: ec.UInt32;
  denominator: ec.UInt32;

 constructor( options?: IUnsignedRationalNumber | null) {
  options = options || {};
  this.numerator = (options.numerator != null) ? options.numerator : 0;
  this.denominator = (options.denominator != null) ? options.denominator : 0;

 }


 encode( out: DataStream) {
  ec.encodeUInt32(this.numerator, out);
  ec.encodeUInt32(this.denominator, out);

 }


 decode( inp: DataStream) {
  this.numerator = ec.decodeUInt32(inp);
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


 clone( target?: UnsignedRationalNumber): UnsignedRationalNumber {
  if (!target) {
   target = new UnsignedRationalNumber();
  }
  target.numerator = this.numerator;
  target.denominator = this.denominator;
  return target;
 }


}
export function decodeUnsignedRationalNumber( inp: DataStream): UnsignedRationalNumber {
  const obj = new UnsignedRationalNumber();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('UnsignedRationalNumber', UnsignedRationalNumber, new ExpandedNodeId(2 /*numeric id*/, 24110, 0));
