

import {ResponseHeader} from './ResponseHeader';
import {MonitoredItemCreateResult} from './MonitoredItemCreateResult';
import {decodeMonitoredItemCreateResult} from './MonitoredItemCreateResult';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ICreateMonitoredItemsResponse {
  responseHeader?: ResponseHeader;
  results?: MonitoredItemCreateResult[];
  diagnosticInfos?: DiagnosticInfo[];
}

/**

*/

export class CreateMonitoredItemsResponse {
  responseHeader: ResponseHeader;
  results: MonitoredItemCreateResult[];
  diagnosticInfos: DiagnosticInfo[];

 constructor( options?: ICreateMonitoredItemsResponse) {
  options = options || {};
  this.responseHeader = (options.responseHeader !== undefined) ? options.responseHeader : new ResponseHeader();
  this.results = (options.results !== undefined) ? options.results : [];
  this.diagnosticInfos = (options.diagnosticInfos !== undefined) ? options.diagnosticInfos : [];

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);
  ec.encodeArray(this.results, out);
  ec.encodeArray(this.diagnosticInfos, out);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);
  this.results = ec.decodeArray(inp, decodeMonitoredItemCreateResult);
  this.diagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('CreateMonitoredItemsResponse', CreateMonitoredItemsResponse, makeExpandedNodeId(754, 0));
