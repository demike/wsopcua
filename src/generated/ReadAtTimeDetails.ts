/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types';
import {HistoryReadDetails} from '.';

export interface IReadAtTimeDetails {
  reqTimes?: Date[];
  useSimpleBounds?: boolean;
}

/**

*/

export class ReadAtTimeDetails extends HistoryReadDetails {
  reqTimes: Date[];
  useSimpleBounds: boolean;

 constructor( options?: IReadAtTimeDetails) {
  options = options || {};
  super();
  this.reqTimes = (options.reqTimes != null) ? options.reqTimes : [];
  this.useSimpleBounds = (options.useSimpleBounds != null) ? options.useSimpleBounds : false;

 }


 encode( out: DataStream) {
  ec.encodeArray(this.reqTimes, out, ec.encodeDateTime);
  ec.encodeBoolean(this.useSimpleBounds, out);

 }


 decode( inp: DataStream) {
  this.reqTimes = ec.decodeArray(inp, ec.decodeDateTime);
  this.useSimpleBounds = ec.decodeBoolean(inp);

 }


 toJSON() {
  const out: any = {};
  out.ReqTimes = ec.jsonEncodeArray(this.reqTimes, ec.jsonEncodeDateTime);
  out.UseSimpleBounds = this.useSimpleBounds;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.reqTimes = ec.jsonDecodeArray( inp.ReqTimes, ec.jsonDecodeDateTime);
  this.useSimpleBounds = inp.UseSimpleBounds;

 }


 clone( target?: ReadAtTimeDetails): ReadAtTimeDetails {
  if (!target) {
   target = new ReadAtTimeDetails();
  }
  target.reqTimes = ec.cloneArray(this.reqTimes);
  target.useSimpleBounds = this.useSimpleBounds;
  return target;
 }


}
export function decodeReadAtTimeDetails( inp: DataStream): ReadAtTimeDetails {
  const obj = new ReadAtTimeDetails();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory';
import { ExpandedNodeId } from '../nodeid';
register_class_definition('ReadAtTimeDetails', ReadAtTimeDetails, new ExpandedNodeId(2 /*numeric id*/, 655, 0));
