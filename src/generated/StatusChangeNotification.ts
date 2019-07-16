

import * as ec from '../basic-types';
import {DiagnosticInfo} from './DiagnosticInfo';
import {DataStream} from '../basic-types/DataStream';
import {NotificationData} from './NotificationData';

export interface IStatusChangeNotification {
  status?: ec.StatusCode;
  diagnosticInfo?: DiagnosticInfo;
}

/**

*/

export class StatusChangeNotification extends NotificationData {
  status: ec.StatusCode;
  diagnosticInfo: DiagnosticInfo;

 constructor( options?: IStatusChangeNotification) {
  options = options || {};
  super();
  this.status = (options.status !== undefined) ? options.status : null;
  this.diagnosticInfo = (options.diagnosticInfo !== undefined) ? options.diagnosticInfo : new DiagnosticInfo();

 }


 encode( out: DataStream) {
  ec.encodeStatusCode(this.status, out);
  this.diagnosticInfo.encode(out);

 }


 decode( inp: DataStream) {
  this.status = ec.decodeStatusCode(inp);
  this.diagnosticInfo.decode(inp);

 }


 clone( target?: StatusChangeNotification): StatusChangeNotification {
  if (!target) {
   target = new StatusChangeNotification();
  }
  target.status = this.status;
  if (this.diagnosticInfo) { target.diagnosticInfo = this.diagnosticInfo.clone(); }
  return target;
 }


}
export function decodeStatusChangeNotification( inp: DataStream): StatusChangeNotification {
  const obj = new StatusChangeNotification();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('StatusChangeNotification', StatusChangeNotification, makeExpandedNodeId(820, 0));
