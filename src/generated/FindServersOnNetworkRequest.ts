/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IFindServersOnNetworkRequest {
  requestHeader?: RequestHeader;
  startingRecordId?: ec.UInt32;
  maxRecordsToReturn?: ec.UInt32;
  serverCapabilityFilter?: string[];
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16030}
*/

export class FindServersOnNetworkRequest {
  requestHeader: RequestHeader;
  startingRecordId: ec.UInt32;
  maxRecordsToReturn: ec.UInt32;
  serverCapabilityFilter: string[];

 constructor( options?: IFindServersOnNetworkRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.startingRecordId = (options.startingRecordId != null) ? options.startingRecordId : 0;
  this.maxRecordsToReturn = (options.maxRecordsToReturn != null) ? options.maxRecordsToReturn : 0;
  this.serverCapabilityFilter = (options.serverCapabilityFilter != null) ? options.serverCapabilityFilter : [];

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeUInt32(this.startingRecordId, out);
  ec.encodeUInt32(this.maxRecordsToReturn, out);
  ec.encodeArray(this.serverCapabilityFilter, out, ec.encodeString);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.startingRecordId = ec.decodeUInt32(inp);
  this.maxRecordsToReturn = ec.decodeUInt32(inp);
  this.serverCapabilityFilter = ec.decodeArray(inp, ec.decodeString);

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.StartingRecordId = this.startingRecordId;
  out.MaxRecordsToReturn = this.maxRecordsToReturn;
  out.ServerCapabilityFilter = this.serverCapabilityFilter;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);
  this.startingRecordId = inp.StartingRecordId;
  this.maxRecordsToReturn = inp.MaxRecordsToReturn;
  this.serverCapabilityFilter = inp.ServerCapabilityFilter;

 }


 clone( target?: FindServersOnNetworkRequest): FindServersOnNetworkRequest {
  if (!target) {
   target = new FindServersOnNetworkRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  target.startingRecordId = this.startingRecordId;
  target.maxRecordsToReturn = this.maxRecordsToReturn;
  target.serverCapabilityFilter = ec.cloneArray(this.serverCapabilityFilter);
  return target;
 }


}
export function decodeFindServersOnNetworkRequest( inp: DataStream): FindServersOnNetworkRequest {
  const obj = new FindServersOnNetworkRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('FindServersOnNetworkRequest', FindServersOnNetworkRequest, new ExpandedNodeId(2 /*numeric id*/, 12208, 0));
