

import * as ec from '../basic-types';
import {ExtensionObject, encodeExtensionObject, decodeExtensionObject} from '../basic-types/extension_object';
import {DataStream} from '../basic-types/DataStream';

export interface IMonitoringParameters {
  clientHandle?: ec.UInt32;
  samplingInterval?: ec.Double;
  filter?: ExtensionObject;
  queueSize?: ec.UInt32;
  discardOldest?: boolean;
}

/**

*/

export class MonitoringParameters {
  clientHandle: ec.UInt32;
  samplingInterval: ec.Double;
  filter: ExtensionObject;
  queueSize: ec.UInt32;
  discardOldest: boolean;

 constructor( options?: IMonitoringParameters) {
  options = options || {};
  this.clientHandle = (options.clientHandle) ? options.clientHandle : null;
  this.samplingInterval = (options.samplingInterval) ? options.samplingInterval : null;
  this.filter = (options.filter) ? options.filter : null;
  this.queueSize = (options.queueSize) ? options.queueSize : null;
  this.discardOldest = (options.discardOldest) ? options.discardOldest : null;

 }


 encode( out: DataStream) {
  ec.encodeUInt32(this.clientHandle, out);
  ec.encodeDouble(this.samplingInterval, out);
  encodeExtensionObject(this.filter, out);
  ec.encodeUInt32(this.queueSize, out);
  ec.encodeBoolean(this.discardOldest, out);

 }


 decode( inp: DataStream) {
  this.clientHandle = ec.decodeUInt32(inp);
  this.samplingInterval = ec.decodeDouble(inp);
  this.filter = decodeExtensionObject(inp);
  this.queueSize = ec.decodeUInt32(inp);
  this.discardOldest = ec.decodeBoolean(inp);

 }


 clone( target?: MonitoringParameters): MonitoringParameters {
  if (!target) {
   target = new MonitoringParameters();
  }
  target.clientHandle = this.clientHandle;
  target.samplingInterval = this.samplingInterval;
  target.filter = this.filter;
  target.queueSize = this.queueSize;
  target.discardOldest = this.discardOldest;
  return target;
 }


}
export function decodeMonitoringParameters( inp: DataStream): MonitoringParameters {
  const obj = new MonitoringParameters();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('MonitoringParameters', MonitoringParameters, makeExpandedNodeId(742, 0));
