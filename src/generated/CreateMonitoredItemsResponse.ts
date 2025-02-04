/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {ResponseHeader} from './ResponseHeader';
import {MonitoredItemCreateResult} from './MonitoredItemCreateResult';
import {decodeMonitoredItemCreateResult} from './MonitoredItemCreateResult';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type ICreateMonitoredItemsResponse = Partial<CreateMonitoredItemsResponse>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16192}
*/

export class CreateMonitoredItemsResponse {
  responseHeader: ResponseHeader;
  results: (MonitoredItemCreateResult)[];
  diagnosticInfos: (DiagnosticInfo)[];

 constructor( options?: ICreateMonitoredItemsResponse | undefined) {
  options = options || {};
  this.responseHeader = (options.responseHeader != null) ? options.responseHeader : new ResponseHeader();
  this.results = (options.results != null) ? options.results : [];
  this.diagnosticInfos = (options.diagnosticInfos != null) ? options.diagnosticInfos : [];

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);
  ec.encodeArray(this.results, out);
  ec.encodeArray(this.diagnosticInfos, out);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);
  this.results = ec.decodeArray(inp, decodeMonitoredItemCreateResult) ?? [];
  this.diagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.ResponseHeader = this.responseHeader;
  out.Results = this.results;
  out.DiagnosticInfos = this.diagnosticInfos;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.responseHeader.fromJSON(inp.ResponseHeader);
  this.results = ec.jsonDecodeStructArray( inp.Results,MonitoredItemCreateResult);
  this.diagnosticInfos = ec.jsonDecodeStructArray( inp.DiagnosticInfos,DiagnosticInfo);

 }


 clone( target?: CreateMonitoredItemsResponse): CreateMonitoredItemsResponse {
  if (!target) {
   target = new CreateMonitoredItemsResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  if (this.results) { target.results = ec.cloneComplexArray(this.results); }
  if (this.diagnosticInfos) { target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos); }
  return target;
 }


}
export function decodeCreateMonitoredItemsResponse( inp: DataStream): CreateMonitoredItemsResponse {
  const obj = new CreateMonitoredItemsResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('CreateMonitoredItemsResponse', CreateMonitoredItemsResponse, new ExpandedNodeId(2 /*numeric id*/, 754, 0));
