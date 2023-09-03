/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {TimestampsToReturn, encodeTimestampsToReturn, decodeTimestampsToReturn} from './TimestampsToReturn';
import {ReadValueId} from './ReadValueId';
import {decodeReadValueId} from './ReadValueId';
import {DataStream} from '../basic-types/DataStream';

export interface IReadRequest {
  requestHeader?: RequestHeader;
  maxAge?: ec.Double;
  timestampsToReturn?: TimestampsToReturn;
  nodesToRead?: ReadValueId[];
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16142}
*/

export class ReadRequest {
  requestHeader: RequestHeader;
  maxAge: ec.Double;
  timestampsToReturn: TimestampsToReturn;
  nodesToRead: ReadValueId[];

 constructor( options?: IReadRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.maxAge = (options.maxAge != null) ? options.maxAge : 0;
  this.timestampsToReturn = (options.timestampsToReturn != null) ? options.timestampsToReturn : null;
  this.nodesToRead = (options.nodesToRead != null) ? options.nodesToRead : [];

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeDouble(this.maxAge, out);
  encodeTimestampsToReturn(this.timestampsToReturn, out);
  ec.encodeArray(this.nodesToRead, out);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.maxAge = ec.decodeDouble(inp);
  this.timestampsToReturn = decodeTimestampsToReturn(inp);
  this.nodesToRead = ec.decodeArray(inp, decodeReadValueId);

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.MaxAge = this.maxAge;
  out.TimestampsToReturn = this.timestampsToReturn;
  out.NodesToRead = this.nodesToRead;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);
  this.maxAge = inp.MaxAge;
  this.timestampsToReturn = inp.TimestampsToReturn;
  this.nodesToRead = ec.jsonDecodeStructArray( inp.NodesToRead,ReadValueId);

 }


 clone( target?: ReadRequest): ReadRequest {
  if (!target) {
   target = new ReadRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  target.maxAge = this.maxAge;
  target.timestampsToReturn = this.timestampsToReturn;
  if (this.nodesToRead) { target.nodesToRead = ec.cloneComplexArray(this.nodesToRead); }
  return target;
 }


}
export function decodeReadRequest( inp: DataStream): ReadRequest {
  const obj = new ReadRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ReadRequest', ReadRequest, new ExpandedNodeId(2 /*numeric id*/, 631, 0));
