/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {ResponseHeader} from './ResponseHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IModifySubscriptionResponse = Partial<ModifySubscriptionResponse>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16206}
*/

export class ModifySubscriptionResponse {
  responseHeader: ResponseHeader;
  revisedPublishingInterval: ec.Double;
  revisedLifetimeCount: ec.UInt32;
  revisedMaxKeepAliveCount: ec.UInt32;

 constructor( options?: IModifySubscriptionResponse) {
  options = options || {};
  this.responseHeader = (options.responseHeader != null) ? options.responseHeader : new ResponseHeader();
  this.revisedPublishingInterval = (options.revisedPublishingInterval != null) ? options.revisedPublishingInterval : 0;
  this.revisedLifetimeCount = (options.revisedLifetimeCount != null) ? options.revisedLifetimeCount : 0;
  this.revisedMaxKeepAliveCount = (options.revisedMaxKeepAliveCount != null) ? options.revisedMaxKeepAliveCount : 0;

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);
  ec.encodeDouble(this.revisedPublishingInterval, out);
  ec.encodeUInt32(this.revisedLifetimeCount, out);
  ec.encodeUInt32(this.revisedMaxKeepAliveCount, out);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);
  this.revisedPublishingInterval = ec.decodeDouble(inp);
  this.revisedLifetimeCount = ec.decodeUInt32(inp);
  this.revisedMaxKeepAliveCount = ec.decodeUInt32(inp);

 }


 toJSON() {
  const out: any = {};
  out.ResponseHeader = this.responseHeader;
  out.RevisedPublishingInterval = this.revisedPublishingInterval;
  out.RevisedLifetimeCount = this.revisedLifetimeCount;
  out.RevisedMaxKeepAliveCount = this.revisedMaxKeepAliveCount;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.responseHeader.fromJSON(inp.ResponseHeader);
  this.revisedPublishingInterval = inp.RevisedPublishingInterval;
  this.revisedLifetimeCount = inp.RevisedLifetimeCount;
  this.revisedMaxKeepAliveCount = inp.RevisedMaxKeepAliveCount;

 }


 clone( target?: ModifySubscriptionResponse): ModifySubscriptionResponse {
  if (!target) {
   target = new ModifySubscriptionResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  target.revisedPublishingInterval = this.revisedPublishingInterval;
  target.revisedLifetimeCount = this.revisedLifetimeCount;
  target.revisedMaxKeepAliveCount = this.revisedMaxKeepAliveCount;
  return target;
 }


}
export function decodeModifySubscriptionResponse( inp: DataStream): ModifySubscriptionResponse {
  const obj = new ModifySubscriptionResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ModifySubscriptionResponse', ModifySubscriptionResponse, new ExpandedNodeId(2 /*numeric id*/, 796, 0));
