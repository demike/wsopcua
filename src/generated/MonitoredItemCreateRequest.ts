/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {ReadValueId} from './ReadValueId';
import {MonitoringMode, encodeMonitoringMode, decodeMonitoringMode} from './MonitoringMode';
import {MonitoringParameters} from './MonitoringParameters';
import {DataStream} from '../basic-types/DataStream';

export type IMonitoredItemCreateRequest = Partial<MonitoredItemCreateRequest>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16189}
*/

export class MonitoredItemCreateRequest {
  itemToMonitor: ReadValueId;
  monitoringMode: MonitoringMode;
  requestedParameters: MonitoringParameters;

 constructor( options?: IMonitoredItemCreateRequest | undefined) {
  options = options || {};
  this.itemToMonitor = (options.itemToMonitor != null) ? options.itemToMonitor : new ReadValueId();
  this.monitoringMode = (options.monitoringMode != null) ? options.monitoringMode : MonitoringMode.Invalid;
  this.requestedParameters = (options.requestedParameters != null) ? options.requestedParameters : new MonitoringParameters();

 }


 encode( out: DataStream) {
  this.itemToMonitor.encode(out);
  encodeMonitoringMode(this.monitoringMode, out);
  this.requestedParameters.encode(out);

 }


 decode( inp: DataStream) {
  this.itemToMonitor.decode(inp);
  this.monitoringMode = decodeMonitoringMode(inp);
  this.requestedParameters.decode(inp);

 }


 toJSON() {
  const out: any = {};
  out.ItemToMonitor = this.itemToMonitor;
  out.MonitoringMode = this.monitoringMode;
  out.RequestedParameters = this.requestedParameters;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.itemToMonitor.fromJSON(inp.ItemToMonitor);
  this.monitoringMode = inp.MonitoringMode;
  this.requestedParameters.fromJSON(inp.RequestedParameters);

 }


 clone( target?: MonitoredItemCreateRequest): MonitoredItemCreateRequest {
  if (!target) {
   target = new MonitoredItemCreateRequest();
  }
  if (this.itemToMonitor) { target.itemToMonitor = this.itemToMonitor.clone(); }
  target.monitoringMode = this.monitoringMode;
  if (this.requestedParameters) { target.requestedParameters = this.requestedParameters.clone(); }
  return target;
 }


}
export function decodeMonitoredItemCreateRequest( inp: DataStream): MonitoredItemCreateRequest {
  const obj = new MonitoredItemCreateRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('MonitoredItemCreateRequest', MonitoredItemCreateRequest, new ExpandedNodeId(2 /*numeric id*/, 745, 0));
