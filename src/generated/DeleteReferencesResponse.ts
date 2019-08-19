

import {ResponseHeader} from './ResponseHeader';
import * as ec from '../basic-types';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import {DataStream} from '../basic-types/DataStream';

export interface IDeleteReferencesResponse {
  responseHeader?: ResponseHeader;
  results?: ec.StatusCode[];
  diagnosticInfos?: DiagnosticInfo[];
}

/**

*/

export class DeleteReferencesResponse {
  responseHeader: ResponseHeader;
  results: ec.StatusCode[];
  diagnosticInfos: DiagnosticInfo[];

 constructor( options?: IDeleteReferencesResponse) {
  options = options || {};
  this.responseHeader = (options.responseHeader != null) ? options.responseHeader : new ResponseHeader();
  this.results = (options.results != null) ? options.results : [];
  this.diagnosticInfos = (options.diagnosticInfos != null) ? options.diagnosticInfos : [];

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


 clone( target?: DeleteReferencesResponse): DeleteReferencesResponse {
  if (!target) {
   target = new DeleteReferencesResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  target.results = ec.cloneArray(this.results);
  if (this.diagnosticInfos) { target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos); }
  return target;
 }


}
export function decodeDeleteReferencesResponse( inp: DataStream): DeleteReferencesResponse {
  const obj = new DeleteReferencesResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('DeleteReferencesResponse', DeleteReferencesResponse, makeExpandedNodeId(509, 0));
