/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {DataChangeTrigger, encodeDataChangeTrigger, decodeDataChangeTrigger} from './DataChangeTrigger';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {MonitoringFilter} from './MonitoringFilter';

export type IDataChangeFilter = Partial<DataChangeFilter>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16181}
*/

export class DataChangeFilter extends MonitoringFilter {
  trigger: DataChangeTrigger;
  deadbandType: ec.UInt32;
  deadbandValue: ec.Double;

 constructor( options?: IDataChangeFilter | null) {
  options = options || {};
  super();
  this.trigger = (options.trigger != null) ? options.trigger : DataChangeTrigger.Invalid;
  this.deadbandType = (options.deadbandType != null) ? options.deadbandType : 0;
  this.deadbandValue = (options.deadbandValue != null) ? options.deadbandValue : 0;

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


 toJSON() {
  const out: any = {};
  out.Trigger = this.trigger;
  out.DeadbandType = this.deadbandType;
  out.DeadbandValue = this.deadbandValue;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.trigger = inp.Trigger;
  this.deadbandType = inp.DeadbandType;
  this.deadbandValue = inp.DeadbandValue;

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
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('DataChangeFilter', DataChangeFilter, new ExpandedNodeId(2 /*numeric id*/, 724, 0));
