/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from '.';
import {ExtensionObject, encodeExtensionObject, decodeExtensionObject, jsonEncodeExtensionObject, jsonDecodeExtensionObject} from '../basic-types/extension_object';
import {TimestampsToReturn, encodeTimestampsToReturn, decodeTimestampsToReturn} from '.';
import * as ec from '../basic-types';
import {HistoryReadValueId} from '.';
import {decodeHistoryReadValueId} from '.';
import {DataStream} from '../basic-types';

export interface IHistoryReadRequest {
  requestHeader?: RequestHeader;
  historyReadDetails?: ExtensionObject;
  timestampsToReturn?: TimestampsToReturn;
  releaseContinuationPoints?: boolean;
  nodesToRead?: HistoryReadValueId[];
}

/**

*/

export class HistoryReadRequest {
  requestHeader: RequestHeader;
  historyReadDetails: ExtensionObject | null;
  timestampsToReturn: TimestampsToReturn;
  releaseContinuationPoints: boolean;
  nodesToRead: HistoryReadValueId[];

 constructor( options?: IHistoryReadRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.historyReadDetails = (options.historyReadDetails != null) ? options.historyReadDetails : null;
  this.timestampsToReturn = (options.timestampsToReturn != null) ? options.timestampsToReturn : null;
  this.releaseContinuationPoints = (options.releaseContinuationPoints != null) ? options.releaseContinuationPoints : false;
  this.nodesToRead = (options.nodesToRead != null) ? options.nodesToRead : [];

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  encodeExtensionObject(this.historyReadDetails, out);
  encodeTimestampsToReturn(this.timestampsToReturn, out);
  ec.encodeBoolean(this.releaseContinuationPoints, out);
  ec.encodeArray(this.nodesToRead, out);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.historyReadDetails = decodeExtensionObject(inp);
  this.timestampsToReturn = decodeTimestampsToReturn(inp);
  this.releaseContinuationPoints = ec.decodeBoolean(inp);
  this.nodesToRead = ec.decodeArray(inp, decodeHistoryReadValueId);

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.HistoryReadDetails = jsonEncodeExtensionObject(this.historyReadDetails);
  out.TimestampsToReturn = this.timestampsToReturn;
  out.ReleaseContinuationPoints = this.releaseContinuationPoints;
  out.NodesToRead = this.nodesToRead;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);
  this.historyReadDetails = jsonDecodeExtensionObject(inp.HistoryReadDetails);
  this.timestampsToReturn = inp.TimestampsToReturn;
  this.releaseContinuationPoints = inp.ReleaseContinuationPoints;
  this.nodesToRead = ec.jsonDecodeStructArray( inp.NodesToRead,HistoryReadValueId);

 }


 clone( target?: HistoryReadRequest): HistoryReadRequest {
  if (!target) {
   target = new HistoryReadRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  target.historyReadDetails = this.historyReadDetails;
  target.timestampsToReturn = this.timestampsToReturn;
  target.releaseContinuationPoints = this.releaseContinuationPoints;
  if (this.nodesToRead) { target.nodesToRead = ec.cloneComplexArray(this.nodesToRead); }
  return target;
 }


}
export function decodeHistoryReadRequest( inp: DataStream): HistoryReadRequest {
  const obj = new HistoryReadRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory';
import { ExpandedNodeId } from '../nodeid';
register_class_definition('HistoryReadRequest', HistoryReadRequest, new ExpandedNodeId(2 /*numeric id*/, 664, 0));
