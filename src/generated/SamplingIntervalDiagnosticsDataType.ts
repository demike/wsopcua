/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ISamplingIntervalDiagnosticsDataType {
  samplingInterval?: ec.Double;
  monitoredItemCount?: ec.UInt32;
  maxMonitoredItemCount?: ec.UInt32;
  disabledMonitoredItemCount?: ec.UInt32;
}

/**

*/

export class SamplingIntervalDiagnosticsDataType {
  samplingInterval: ec.Double;
  monitoredItemCount: ec.UInt32;
  maxMonitoredItemCount: ec.UInt32;
  disabledMonitoredItemCount: ec.UInt32;

 constructor( options?: ISamplingIntervalDiagnosticsDataType) {
  options = options || {};
  this.samplingInterval = (options.samplingInterval != null) ? options.samplingInterval : 0;
  this.monitoredItemCount = (options.monitoredItemCount != null) ? options.monitoredItemCount : 0;
  this.maxMonitoredItemCount = (options.maxMonitoredItemCount != null) ? options.maxMonitoredItemCount : 0;
  this.disabledMonitoredItemCount = (options.disabledMonitoredItemCount != null) ? options.disabledMonitoredItemCount : 0;

 }


 encode( out: DataStream) {
  ec.encodeDouble(this.samplingInterval, out);
  ec.encodeUInt32(this.monitoredItemCount, out);
  ec.encodeUInt32(this.maxMonitoredItemCount, out);
  ec.encodeUInt32(this.disabledMonitoredItemCount, out);

 }


 decode( inp: DataStream) {
  this.samplingInterval = ec.decodeDouble(inp);
  this.monitoredItemCount = ec.decodeUInt32(inp);
  this.maxMonitoredItemCount = ec.decodeUInt32(inp);
  this.disabledMonitoredItemCount = ec.decodeUInt32(inp);

 }


 toJSON() {
  const out: any = {};
  out.SamplingInterval = this.samplingInterval;
  out.MonitoredItemCount = this.monitoredItemCount;
  out.MaxMonitoredItemCount = this.maxMonitoredItemCount;
  out.DisabledMonitoredItemCount = this.disabledMonitoredItemCount;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.samplingInterval = inp.SamplingInterval;
  this.monitoredItemCount = inp.MonitoredItemCount;
  this.maxMonitoredItemCount = inp.MaxMonitoredItemCount;
  this.disabledMonitoredItemCount = inp.DisabledMonitoredItemCount;

 }


 clone( target?: SamplingIntervalDiagnosticsDataType): SamplingIntervalDiagnosticsDataType {
  if (!target) {
   target = new SamplingIntervalDiagnosticsDataType();
  }
  target.samplingInterval = this.samplingInterval;
  target.monitoredItemCount = this.monitoredItemCount;
  target.maxMonitoredItemCount = this.maxMonitoredItemCount;
  target.disabledMonitoredItemCount = this.disabledMonitoredItemCount;
  return target;
 }


}
export function decodeSamplingIntervalDiagnosticsDataType( inp: DataStream): SamplingIntervalDiagnosticsDataType {
  const obj = new SamplingIntervalDiagnosticsDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('SamplingIntervalDiagnosticsDataType', SamplingIntervalDiagnosticsDataType, new ExpandedNodeId(2 /*numeric id*/, 858, 0));
