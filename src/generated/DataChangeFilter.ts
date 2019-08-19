

import {DataChangeTrigger, encodeDataChangeTrigger, decodeDataChangeTrigger} from './DataChangeTrigger';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {MonitoringFilter} from './MonitoringFilter';

export interface IDataChangeFilter {
  trigger?: DataChangeTrigger;
  deadbandType?: ec.UInt32;
  deadbandValue?: ec.Double;
}

/**

*/

export class DataChangeFilter extends MonitoringFilter {
  trigger: DataChangeTrigger;
  deadbandType: ec.UInt32;
  deadbandValue: ec.Double;

 constructor( options?: IDataChangeFilter) {
  options = options || {};
  super();
  this.trigger = (options.trigger != null) ? options.trigger : null;
  this.deadbandType = (options.deadbandType != null) ? options.deadbandType : null;
  this.deadbandValue = (options.deadbandValue != null) ? options.deadbandValue : null;

 }


 encode( out: DataStream) {
  encodeDataChangeTrigger(this.trigger, out);
  ec.encodeUInt32(this.deadbandType, out);
  ec.encodeDouble(this.deadbandValue, out);

 }


 decode( inp: DataStream) {
  this.trigger = decodeDataChangeTrigger(inp);
  this.deadbandType = ec.decodeUInt32(inp);
  this.deadbandValue = ec.decodeDouble(inp);

 }


 clone( target?: DataChangeFilter): DataChangeFilter {
  if (!target) {
   target = new DataChangeFilter();
  }
  target.trigger = this.trigger;
  target.deadbandType = this.deadbandType;
  target.deadbandValue = this.deadbandValue;
  return target;
 }


}
export function decodeDataChangeFilter( inp: DataStream): DataChangeFilter {
  const obj = new DataChangeFilter();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('DataChangeFilter', DataChangeFilter, makeExpandedNodeId(724, 0));
