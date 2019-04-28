

import {ResponseHeader} from './ResponseHeader';
import * as ec from '../basic-types';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import {DataStream} from '../basic-types/DataStream';

export interface IWriteResponse {
  responseHeader?: ResponseHeader;
  results?: ec.StatusCode[];
  diagnosticInfos?: DiagnosticInfo[];
}

/**

*/

export class WriteResponse {
  responseHeader: ResponseHeader;
  results: ec.StatusCode[];
  diagnosticInfos: DiagnosticInfo[];

 constructor( options?: IWriteResponse) {
  options = options || {};
  this.responseHeader = (options.responseHeader) ? options.responseHeader : new ResponseHeader();
  this.results = (options.results) ? options.results : [];
  this.diagnosticInfos = (options.diagnosticInfos) ? options.diagnosticInfos : [];

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);
  ec.encodeArray(this.results, out, ec.encodeStatusCode);
  ec.encodeArray(this.diagnosticInfos, out);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);
  this.results = ec.decodeArray(inp, ec.decodeStatusCode);
  this.diagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);

 }


 clone( target?: WriteResponse): WriteResponse {
  if (!target) {
   target = new WriteResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  target.results = ec.cloneArray(this.results);
  if (this.diagnosticInfos) { target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos); }
  return target;
 }


}
export function decodeWriteResponse( inp: DataStream): WriteResponse {
  const obj = new WriteResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('WriteResponse', WriteResponse, makeExpandedNodeId(676, 0));
