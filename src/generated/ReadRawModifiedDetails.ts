/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {HistoryReadDetails} from './HistoryReadDetails';

export interface IReadRawModifiedDetails {
  isReadModified?: boolean;
  startTime?: Date;
  endTime?: Date;
  numValuesPerNode?: ec.UInt32;
  returnBounds?: boolean;
}

/**

*/

export class ReadRawModifiedDetails extends HistoryReadDetails {
  isReadModified: boolean;
  startTime: Date;
  endTime: Date;
  numValuesPerNode: ec.UInt32;
  returnBounds: boolean;

 constructor( options?: IReadRawModifiedDetails) {
  options = options || {};
  super();
  this.isReadModified = (options.isReadModified != null) ? options.isReadModified : false;
  this.startTime = (options.startTime != null) ? options.startTime : new Date();
  this.endTime = (options.endTime != null) ? options.endTime : new Date();
  this.numValuesPerNode = (options.numValuesPerNode != null) ? options.numValuesPerNode : 0;
  this.returnBounds = (options.returnBounds != null) ? options.returnBounds : false;

 }


 encode( out: DataStream) {
  ec.encodeBoolean(this.isReadModified, out);
  ec.encodeDateTime(this.startTime, out);
  ec.encodeDateTime(this.endTime, out);
  ec.encodeUInt32(this.numValuesPerNode, out);
  ec.encodeBoolean(this.returnBounds, out);

 }


 decode( inp: DataStream) {
  this.isReadModified = ec.decodeBoolean(inp);
  this.startTime = ec.decodeDateTime(inp);
  this.endTime = ec.decodeDateTime(inp);
  this.numValuesPerNode = ec.decodeUInt32(inp);
  this.returnBounds = ec.decodeBoolean(inp);

 }


 toJSON() {
  const out: any = {};
  out.IsReadModified = this.isReadModified;
  out.StartTime = ec.jsonEncodeDateTime(this.startTime);
  out.EndTime = ec.jsonEncodeDateTime(this.endTime);
  out.NumValuesPerNode = this.numValuesPerNode;
  out.ReturnBounds = this.returnBounds;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.isReadModified = inp.IsReadModified;
  this.startTime = ec.jsonDecodeDateTime(inp.StartTime);
  this.endTime = ec.jsonDecodeDateTime(inp.EndTime);
  this.numValuesPerNode = inp.NumValuesPerNode;
  this.returnBounds = inp.ReturnBounds;

 }


 clone( target?: ReadRawModifiedDetails): ReadRawModifiedDetails {
  if (!target) {
   target = new ReadRawModifiedDetails();
  }
  target.isReadModified = this.isReadModified;
  target.startTime = this.startTime;
  target.endTime = this.endTime;
  target.numValuesPerNode = this.numValuesPerNode;
  target.returnBounds = this.returnBounds;
  return target;
 }


}
export function decodeReadRawModifiedDetails( inp: DataStream): ReadRawModifiedDetails {
  const obj = new ReadRawModifiedDetails();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ReadRawModifiedDetails', ReadRawModifiedDetails, new ExpandedNodeId(2 /*numeric id*/, 649, 0));
