

import * as ec from '../basic-types';
import {MonitoringParameters} from './MonitoringParameters';
import {DataStream} from '../basic-types/DataStream';

export interface IMonitoredItemModifyRequest {
  monitoredItemId?: ec.UInt32;
  requestedParameters?: MonitoringParameters;
}

/**

*/

export class MonitoredItemModifyRequest {
  monitoredItemId: ec.UInt32;
  requestedParameters: MonitoringParameters;

 constructor( options?: IMonitoredItemModifyRequest) {
  options = options || {};
  this.monitoredItemId = (options.monitoredItemId !== undefined) ? options.monitoredItemId : null;
  this.requestedParameters = (options.requestedParameters !== undefined) ? options.requestedParameters : new MonitoringParameters();

 }


 encode( out: DataStream) {
  ec.encodeUInt32(this.monitoredItemId, out);
  this.requestedParameters.encode(out);

 }


 decode( inp: DataStream) {
  this.monitoredItemId = ec.decodeUInt32(inp);
  this.requestedParameters.decode(inp);

 }


 clone( target?: MonitoredItemModifyRequest): MonitoredItemModifyRequest {
  if (!target) {
   target = new MonitoredItemModifyRequest();
  }
  target.monitoredItemId = this.monitoredItemId;
  if (this.requestedParameters) { target.requestedParameters = this.requestedParameters.clone(); }
  return target;
 }


}
export function decodeMonitoredItemModifyRequest( inp: DataStream): MonitoredItemModifyRequest {
  const obj = new MonitoredItemModifyRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('MonitoredItemModifyRequest', MonitoredItemModifyRequest, makeExpandedNodeId(757, 0));
