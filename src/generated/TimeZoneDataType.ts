/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ITimeZoneDataType {
  offset?: ec.Int16;
  daylightSavingInOffset?: boolean;
}

/**

*/

export class TimeZoneDataType {
  offset: ec.Int16;
  daylightSavingInOffset: boolean;

 constructor( options?: ITimeZoneDataType) {
  options = options || {};
  this.offset = (options.offset != null) ? options.offset : 0;
  this.daylightSavingInOffset = (options.daylightSavingInOffset != null) ? options.daylightSavingInOffset : false;

 }


 encode( out: DataStream) {
  ec.encodeInt16(this.offset, out);
  ec.encodeBoolean(this.daylightSavingInOffset, out);

 }


 decode( inp: DataStream) {
  this.offset = ec.decodeInt16(inp);
  this.daylightSavingInOffset = ec.decodeBoolean(inp);

 }


 clone( target?: TimeZoneDataType): TimeZoneDataType {
  if (!target) {
   target = new TimeZoneDataType();
  }
  target.offset = this.offset;
  target.daylightSavingInOffset = this.daylightSavingInOffset;
  return target;
 }


}
export function decodeTimeZoneDataType( inp: DataStream): TimeZoneDataType {
  const obj = new TimeZoneDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('TimeZoneDataType', TimeZoneDataType, makeExpandedNodeId(8917, 0));
