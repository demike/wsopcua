/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IRange {
  low?: ec.Double;
  high?: ec.Double;
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16244}
*/

export class Range {
  low: ec.Double;
  high: ec.Double;

 constructor( options?: IRange) {
  options = options || {};
  this.low = (options.low != null) ? options.low : 0;
  this.high = (options.high != null) ? options.high : 0;

 }


 encode( out: DataStream) {
  ec.encodeDouble(this.low, out);
  ec.encodeDouble(this.high, out);

 }


 decode( inp: DataStream) {
  this.low = ec.decodeDouble(inp);
  this.high = ec.decodeDouble(inp);

 }


 toJSON() {
  const out: any = {};
  out.Low = this.low;
  out.High = this.high;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.low = inp.Low;
  this.high = inp.High;

 }


 clone( target?: Range): Range {
  if (!target) {
   target = new Range();
  }
  target.low = this.low;
  target.high = this.high;
  return target;
 }


}
export function decodeRange( inp: DataStream): Range {
  const obj = new Range();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('Range', Range, new ExpandedNodeId(2 /*numeric id*/, 886, 0));
