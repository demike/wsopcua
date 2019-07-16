

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IServerDiagnosticsSummaryDataType {
  serverViewCount?: ec.UInt32;
  currentSessionCount?: ec.UInt32;
  cumulatedSessionCount?: ec.UInt32;
  securityRejectedSessionCount?: ec.UInt32;
  rejectedSessionCount?: ec.UInt32;
  sessionTimeoutCount?: ec.UInt32;
  sessionAbortCount?: ec.UInt32;
  currentSubscriptionCount?: ec.UInt32;
  cumulatedSubscriptionCount?: ec.UInt32;
  publishingIntervalCount?: ec.UInt32;
  securityRejectedRequestsCount?: ec.UInt32;
  rejectedRequestsCount?: ec.UInt32;
}

/**

*/

export class ServerDiagnosticsSummaryDataType {
  serverViewCount: ec.UInt32;
  currentSessionCount: ec.UInt32;
  cumulatedSessionCount: ec.UInt32;
  securityRejectedSessionCount: ec.UInt32;
  rejectedSessionCount: ec.UInt32;
  sessionTimeoutCount: ec.UInt32;
  sessionAbortCount: ec.UInt32;
  currentSubscriptionCount: ec.UInt32;
  cumulatedSubscriptionCount: ec.UInt32;
  publishingIntervalCount: ec.UInt32;
  securityRejectedRequestsCount: ec.UInt32;
  rejectedRequestsCount: ec.UInt32;

 constructor( options?: IServerDiagnosticsSummaryDataType) {
  options = options || {};
  this.serverViewCount = (options.serverViewCount !== undefined) ? options.serverViewCount : null;
  this.currentSessionCount = (options.currentSessionCount !== undefined) ? options.currentSessionCount : null;
  this.cumulatedSessionCount = (options.cumulatedSessionCount !== undefined) ? options.cumulatedSessionCount : null;
  this.securityRejectedSessionCount = (options.securityRejectedSessionCount !== undefined) ? options.securityRejectedSessionCount : null;
  this.rejectedSessionCount = (options.rejectedSessionCount !== undefined) ? options.rejectedSessionCount : null;
  this.sessionTimeoutCount = (options.sessionTimeoutCount !== undefined) ? options.sessionTimeoutCount : null;
  this.sessionAbortCount = (options.sessionAbortCount !== undefined) ? options.sessionAbortCount : null;
  this.currentSubscriptionCount = (options.currentSubscriptionCount !== undefined) ? options.currentSubscriptionCount : null;
  this.cumulatedSubscriptionCount = (options.cumulatedSubscriptionCount !== undefined) ? options.cumulatedSubscriptionCount : null;
  this.publishingIntervalCount = (options.publishingIntervalCount !== undefined) ? options.publishingIntervalCount : null;
  this.securityRejectedRequestsCount = (options.securityRejectedRequestsCount !== undefined) ? options.securityRejectedRequestsCount : null;
  this.rejectedRequestsCount = (options.rejectedRequestsCount !== undefined) ? options.rejectedRequestsCount : null;

 }


 encode( out: DataStream) {
  ec.encodeUInt32(this.serverViewCount, out);
  ec.encodeUInt32(this.currentSessionCount, out);
  ec.encodeUInt32(this.cumulatedSessionCount, out);
  ec.encodeUInt32(this.securityRejectedSessionCount, out);
  ec.encodeUInt32(this.rejectedSessionCount, out);
  ec.encodeUInt32(this.sessionTimeoutCount, out);
  ec.encodeUInt32(this.sessionAbortCount, out);
  ec.encodeUInt32(this.currentSubscriptionCount, out);
  ec.encodeUInt32(this.cumulatedSubscriptionCount, out);
  ec.encodeUInt32(this.publishingIntervalCount, out);
  ec.encodeUInt32(this.securityRejectedRequestsCount, out);
  ec.encodeUInt32(this.rejectedRequestsCount, out);

 }


 decode( inp: DataStream) {
  this.serverViewCount = ec.decodeUInt32(inp);
  this.currentSessionCount = ec.decodeUInt32(inp);
  this.cumulatedSessionCount = ec.decodeUInt32(inp);
  this.securityRejectedSessionCount = ec.decodeUInt32(inp);
  this.rejectedSessionCount = ec.decodeUInt32(inp);
  this.sessionTimeoutCount = ec.decodeUInt32(inp);
  this.sessionAbortCount = ec.decodeUInt32(inp);
  this.currentSubscriptionCount = ec.decodeUInt32(inp);
  this.cumulatedSubscriptionCount = ec.decodeUInt32(inp);
  this.publishingIntervalCount = ec.decodeUInt32(inp);
  this.securityRejectedRequestsCount = ec.decodeUInt32(inp);
  this.rejectedRequestsCount = ec.decodeUInt32(inp);

 }


 clone( target?: ServerDiagnosticsSummaryDataType): ServerDiagnosticsSummaryDataType {
  if (!target) {
   target = new ServerDiagnosticsSummaryDataType();
  }
  target.serverViewCount = this.serverViewCount;
  target.currentSessionCount = this.currentSessionCount;
  target.cumulatedSessionCount = this.cumulatedSessionCount;
  target.securityRejectedSessionCount = this.securityRejectedSessionCount;
  target.rejectedSessionCount = this.rejectedSessionCount;
  target.sessionTimeoutCount = this.sessionTimeoutCount;
  target.sessionAbortCount = this.sessionAbortCount;
  target.currentSubscriptionCount = this.currentSubscriptionCount;
  target.cumulatedSubscriptionCount = this.cumulatedSubscriptionCount;
  target.publishingIntervalCount = this.publishingIntervalCount;
  target.securityRejectedRequestsCount = this.securityRejectedRequestsCount;
  target.rejectedRequestsCount = this.rejectedRequestsCount;
  return target;
 }


}
export function decodeServerDiagnosticsSummaryDataType( inp: DataStream): ServerDiagnosticsSummaryDataType {
  const obj = new ServerDiagnosticsSummaryDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ServerDiagnosticsSummaryDataType', ServerDiagnosticsSummaryDataType, makeExpandedNodeId(861, 0));
