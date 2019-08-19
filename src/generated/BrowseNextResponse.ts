

import {ResponseHeader} from './ResponseHeader';
import {BrowseResult} from './BrowseResult';
import {decodeBrowseResult} from './BrowseResult';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IBrowseNextResponse {
  responseHeader?: ResponseHeader;
  results?: BrowseResult[];
  diagnosticInfos?: DiagnosticInfo[];
}

/**

*/

export class BrowseNextResponse {
  responseHeader: ResponseHeader;
  results: BrowseResult[];
  diagnosticInfos: DiagnosticInfo[];

 constructor( options?: IBrowseNextResponse) {
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
  this.results = ec.decodeArray(inp, decodeBrowseResult);
  this.diagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);

 }


 clone( target?: BrowseNextResponse): BrowseNextResponse {
  if (!target) {
   target = new BrowseNextResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  if (this.results) { target.results = ec.cloneComplexArray(this.results); }
  if (this.diagnosticInfos) { target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos); }
  return target;
 }


}
export function decodeBrowseNextResponse( inp: DataStream): BrowseNextResponse {
  const obj = new BrowseNextResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('BrowseNextResponse', BrowseNextResponse, makeExpandedNodeId(536, 0));
