

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
  this.samplingInterval = (options.samplingInterval !== undefined) ? options.samplingInterval : null;
  this.monitoredItemCount = (options.monitoredItemCount !== undefined) ? options.monitoredItemCount : null;
  this.maxMonitoredItemCount = (options.maxMonitoredItemCount !== undefined) ? options.maxMonitoredItemCount : null;
  this.disabledMonitoredItemCount = (options.disabledMonitoredItemCount !== undefined) ? options.disabledMonitoredItemCount : null;

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('SamplingIntervalDiagnosticsDataType', SamplingIntervalDiagnosticsDataType, makeExpandedNodeId(858, 0));
