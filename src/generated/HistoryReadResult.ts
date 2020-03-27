/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {ExtensionObject, encodeExtensionObject, decodeExtensionObject} from '../basic-types/extension_object';
import {DataStream} from '../basic-types/DataStream';

export interface IHistoryReadResult {
  statusCode?: ec.StatusCode;
  continuationPoint?: Uint8Array;
  historyData?: ExtensionObject;
}

/**

*/

export class HistoryReadResult {
  statusCode: ec.StatusCode | null;
  continuationPoint: Uint8Array | null;
  historyData: ExtensionObject | null;

 constructor( options?: IHistoryReadResult) {
  options = options || {};
  this.statusCode = (options.statusCode != null) ? options.statusCode : null;
  this.continuationPoint = (options.continuationPoint != null) ? options.continuationPoint : null;
  this.historyData = (options.historyData != null) ? options.historyData : null;

 }


 encode( out: DataStream) {
  ec.encodeStatusCode(this.statusCode, out);
  ec.encodeByteString(this.continuationPoint, out);
  encodeExtensionObject(this.historyData, out);

 }


 decode( inp: DataStream) {
  this.statusCode = ec.decodeStatusCode(inp);
  this.continuationPoint = ec.decodeByteString(inp);
  this.historyData = decodeExtensionObject(inp);

 }


 toJSON() {
  const out: any = {};
  out.StatusCode = ec.jsonEncodeStatusCode(this.statusCode);
  out.ContinuationPoint = this.continuationPoint;
  out.HistoryData = this.historyData;
 return out;
 }


 fromJSON( inp: any) {
  this.statusCode  = ec.jsonDecodeStatusCode(inp.StatusCode);
  this.continuationPoint = inp.ContinuationPoint;
  this.historyData = inp.HistoryData;

 }


 clone( target?: HistoryReadResult): HistoryReadResult {
  if (!target) {
   target = new HistoryReadResult();
  }
  target.statusCode = this.statusCode;
  target.continuationPoint = this.continuationPoint;
  target.historyData = this.historyData;
  return target;
 }


}
export function decodeHistoryReadResult( inp: DataStream): HistoryReadResult {
  const obj = new HistoryReadResult();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('HistoryReadResult', HistoryReadResult, new ExpandedNodeId(2 /*numeric id*/, 640, 0));
