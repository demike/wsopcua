/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IServerDiagnosticsSummaryDataType = Partial<ServerDiagnosticsSummaryDataType>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16234}
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

 constructor( options?: IServerDiagnosticsSummaryDataType | undefined) {
  options = options || {};
  this.serverViewCount = (options.serverViewCount != null) ? options.serverViewCount : 0;
  this.currentSessionCount = (options.currentSessionCount != null) ? options.currentSessionCount : 0;
  this.cumulatedSessionCount = (options.cumulatedSessionCount != null) ? options.cumulatedSessionCount : 0;
  this.securityRejectedSessionCount = (options.securityRejectedSessionCount != null) ? options.securityRejectedSessionCount : 0;
  this.rejectedSessionCount = (options.rejectedSessionCount != null) ? options.rejectedSessionCount : 0;
  this.sessionTimeoutCount = (options.sessionTimeoutCount != null) ? options.sessionTimeoutCount : 0;
  this.sessionAbortCount = (options.sessionAbortCount != null) ? options.sessionAbortCount : 0;
  this.currentSubscriptionCount = (options.currentSubscriptionCount != null) ? options.currentSubscriptionCount : 0;
  this.cumulatedSubscriptionCount = (options.cumulatedSubscriptionCount != null) ? options.cumulatedSubscriptionCount : 0;
  this.publishingIntervalCount = (options.publishingIntervalCount != null) ? options.publishingIntervalCount : 0;
  this.securityRejectedRequestsCount = (options.securityRejectedRequestsCount != null) ? options.securityRejectedRequestsCount : 0;
  this.rejectedRequestsCount = (options.rejectedRequestsCount != null) ? options.rejectedRequestsCount : 0;

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


 toJSON() {
  const out: any = {};
  out.ServerViewCount = this.serverViewCount;
  out.CurrentSessionCount = this.currentSessionCount;
  out.CumulatedSessionCount = this.cumulatedSessionCount;
  out.SecurityRejectedSessionCount = this.securityRejectedSessionCount;
  out.RejectedSessionCount = this.rejectedSessionCount;
  out.SessionTimeoutCount = this.sessionTimeoutCount;
  out.SessionAbortCount = this.sessionAbortCount;
  out.CurrentSubscriptionCount = this.currentSubscriptionCount;
  out.CumulatedSubscriptionCount = this.cumulatedSubscriptionCount;
  out.PublishingIntervalCount = this.publishingIntervalCount;
  out.SecurityRejectedRequestsCount = this.securityRejectedRequestsCount;
  out.RejectedRequestsCount = this.rejectedRequestsCount;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.serverViewCount = inp.ServerViewCount;
  this.currentSessionCount = inp.CurrentSessionCount;
  this.cumulatedSessionCount = inp.CumulatedSessionCount;
  this.securityRejectedSessionCount = inp.SecurityRejectedSessionCount;
  this.rejectedSessionCount = inp.RejectedSessionCount;
  this.sessionTimeoutCount = inp.SessionTimeoutCount;
  this.sessionAbortCount = inp.SessionAbortCount;
  this.currentSubscriptionCount = inp.CurrentSubscriptionCount;
  this.cumulatedSubscriptionCount = inp.CumulatedSubscriptionCount;
  this.publishingIntervalCount = inp.PublishingIntervalCount;
  this.securityRejectedRequestsCount = inp.SecurityRejectedRequestsCount;
  this.rejectedRequestsCount = inp.RejectedRequestsCount;

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
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ServerDiagnosticsSummaryDataType', ServerDiagnosticsSummaryDataType, new ExpandedNodeId(2 /*numeric id*/, 861, 0));
