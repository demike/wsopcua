/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DiagnosticInfo} from '.';
import {DataStream} from '../basic-types';

export interface IStatusResult {
  statusCode?: ec.StatusCode;
  diagnosticInfo?: DiagnosticInfo;
}

/**

*/

export class StatusResult {
  statusCode: ec.StatusCode | null;
  diagnosticInfo: DiagnosticInfo;

 constructor( options?: IStatusResult) {
  options = options || {};
  this.statusCode = (options.statusCode != null) ? options.statusCode : null;
  this.diagnosticInfo = (options.diagnosticInfo != null) ? options.diagnosticInfo : new DiagnosticInfo();

 }


 encode( out: DataStream) {
  ec.encodeStatusCode(this.statusCode, out);
  this.diagnosticInfo.encode(out);

 }


 decode( inp: DataStream) {
  this.statusCode = ec.decodeStatusCode(inp);
  this.diagnosticInfo.decode(inp);

 }


 toJSON() {
  const out: any = {};
  out.StatusCode = ec.jsonEncodeStatusCode(this.statusCode);
  out.DiagnosticInfo = this.diagnosticInfo;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.statusCode = ec.jsonDecodeStatusCode(inp.StatusCode);
  this.diagnosticInfo.fromJSON(inp.DiagnosticInfo);

 }


 clone( target?: StatusResult): StatusResult {
  if (!target) {
   target = new StatusResult();
  }
  target.statusCode = this.statusCode;
  if (this.diagnosticInfo) { target.diagnosticInfo = this.diagnosticInfo.clone(); }
  return target;
 }


}
export function decodeStatusResult( inp: DataStream): StatusResult {
  const obj = new StatusResult();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory';
import { ExpandedNodeId } from '../nodeid';
register_class_definition('StatusResult', StatusResult, new ExpandedNodeId(2 /*numeric id*/, 301, 0));
