/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type ISetPublishingModeRequest = Partial<SetPublishingModeRequest>;

/**

*/

export class SetPublishingModeRequest {
  requestHeader: RequestHeader;
  publishingEnabled: boolean;
  subscriptionIds: (ec.UInt32)[];

 constructor( options?: ISetPublishingModeRequest | null) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.publishingEnabled = (options.publishingEnabled != null) ? options.publishingEnabled : false;
  this.subscriptionIds = (options.subscriptionIds != null) ? options.subscriptionIds : [];

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeBoolean(this.publishingEnabled, out);
  ec.encodeArray(this.subscriptionIds, out, ec.encodeUInt32);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.publishingEnabled = ec.decodeBoolean(inp);
  this.subscriptionIds = ec.decodeArray(inp, ec.decodeUInt32) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.PublishingEnabled = this.publishingEnabled;
  out.SubscriptionIds = this.subscriptionIds;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);
  this.publishingEnabled = inp.PublishingEnabled;
  this.subscriptionIds = inp.SubscriptionIds;

 }


 clone( target?: SetPublishingModeRequest): SetPublishingModeRequest {
  if (!target) {
   target = new SetPublishingModeRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  target.publishingEnabled = this.publishingEnabled;
  target.subscriptionIds = ec.cloneArray(this.subscriptionIds);
  return target;
 }


}
export function decodeSetPublishingModeRequest( inp: DataStream): SetPublishingModeRequest {
  const obj = new SetPublishingModeRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('SetPublishingModeRequest', SetPublishingModeRequest, new ExpandedNodeId(2 /*numeric id*/, 799, 0));
