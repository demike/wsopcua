

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IServiceCounterDataType {
  totalCount?: ec.UInt32;
  errorCount?: ec.UInt32;
}

/**

*/

export class ServiceCounterDataType {
  totalCount: ec.UInt32;
  errorCount: ec.UInt32;

 constructor( options?: IServiceCounterDataType) {
  options = options || {};
  this.totalCount = (options.totalCount !== undefined) ? options.totalCount : null;
  this.errorCount = (options.errorCount !== undefined) ? options.errorCount : null;

 }


 encode( out: DataStream) {
  ec.encodeUInt32(this.totalCount, out);
  ec.encodeUInt32(this.errorCount, out);

 }


 decode( inp: DataStream) {
  this.totalCount = ec.decodeUInt32(inp);
  this.errorCount = ec.decodeUInt32(inp);

 }


 clone( target?: ServiceCounterDataType): ServiceCounterDataType {
  if (!target) {
   target = new ServiceCounterDataType();
  }
  target.totalCount = this.totalCount;
  target.errorCount = this.errorCount;
  return target;
 }


}
export function decodeServiceCounterDataType( inp: DataStream): ServiceCounterDataType {
  const obj = new ServiceCounterDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ServiceCounterDataType', ServiceCounterDataType, makeExpandedNodeId(873, 0));
