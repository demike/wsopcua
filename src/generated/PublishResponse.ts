/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {ResponseHeader} from './ResponseHeader';
import * as ec from '../basic-types';
import {NotificationMessage} from './NotificationMessage';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import {DataStream} from '../basic-types/DataStream';

export interface IPublishResponse {
  responseHeader?: ResponseHeader;
  subscriptionId?: ec.UInt32;
  availableSequenceNumbers?: ec.UInt32[];
  moreNotifications?: boolean;
  notificationMessage?: NotificationMessage;
  results?: ec.StatusCode[];
  diagnosticInfos?: DiagnosticInfo[];
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16219}
*/

export class PublishResponse {
  responseHeader: ResponseHeader;
  subscriptionId: ec.UInt32;
  availableSequenceNumbers: ec.UInt32[];
  moreNotifications: boolean;
  notificationMessage: NotificationMessage;
  results: ec.StatusCode[];
  diagnosticInfos: DiagnosticInfo[];

 constructor( options?: IPublishResponse) {
  options = options || {};
  this.responseHeader = (options.responseHeader != null) ? options.responseHeader : new ResponseHeader();
  this.subscriptionId = (options.subscriptionId != null) ? options.subscriptionId : 0;
  this.availableSequenceNumbers = (options.availableSequenceNumbers != null) ? options.availableSequenceNumbers : [];
  this.moreNotifications = (options.moreNotifications != null) ? options.moreNotifications : false;
  this.notificationMessage = (options.notificationMessage != null) ? options.notificationMessage : new NotificationMessage();
  this.results = (options.results != null) ? options.results : [];
  this.diagnosticInfos = (options.diagnosticInfos != null) ? options.diagnosticInfos : [];

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);
  ec.encodeUInt32(this.subscriptionId, out);
  ec.encodeArray(this.availableSequenceNumbers, out, ec.encodeUInt32);
  ec.encodeBoolean(this.moreNotifications, out);
  this.notificationMessage.encode(out);
  ec.encodeArray(this.results, out, ec.encodeStatusCode);
  ec.encodeArray(this.diagnosticInfos, out);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);
  this.subscriptionId = ec.decodeUInt32(inp);
  this.availableSequenceNumbers = ec.decodeArray(inp, ec.decodeUInt32);
  this.moreNotifications = ec.decodeBoolean(inp);
  this.notificationMessage.decode(inp);
  this.results = ec.decodeArray(inp, ec.decodeStatusCode);
  this.diagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);

 }


 toJSON() {
  const out: any = {};
  out.ResponseHeader = this.responseHeader;
  out.SubscriptionId = this.subscriptionId;
  out.AvailableSequenceNumbers = this.availableSequenceNumbers;
  out.MoreNotifications = this.moreNotifications;
  out.NotificationMessage = this.notificationMessage;
  out.Results = ec.jsonEncodeArray(this.results, ec.jsonEncodeStatusCode);
  out.DiagnosticInfos = this.diagnosticInfos;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.responseHeader.fromJSON(inp.ResponseHeader);
  this.subscriptionId = inp.SubscriptionId;
  this.availableSequenceNumbers = inp.AvailableSequenceNumbers;
  this.moreNotifications = inp.MoreNotifications;
  this.notificationMessage.fromJSON(inp.NotificationMessage);
  this.results = ec.jsonDecodeArray( inp.Results, ec.jsonDecodeStatusCode);
  this.diagnosticInfos = ec.jsonDecodeStructArray( inp.DiagnosticInfos,DiagnosticInfo);

 }


 clone( target?: PublishResponse): PublishResponse {
  if (!target) {
   target = new PublishResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  target.subscriptionId = this.subscriptionId;
  target.availableSequenceNumbers = ec.cloneArray(this.availableSequenceNumbers);
  target.moreNotifications = this.moreNotifications;
  if (this.notificationMessage) { target.notificationMessage = this.notificationMessage.clone(); }
  target.results = ec.cloneArray(this.results);
  if (this.diagnosticInfos) { target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos); }
  return target;
 }


}
export function decodePublishResponse( inp: DataStream): PublishResponse {
  const obj = new PublishResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('PublishResponse', PublishResponse, new ExpandedNodeId(2 /*numeric id*/, 827, 0));
