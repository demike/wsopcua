/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {ResponseHeader} from './ResponseHeader';
import {BrowsePathResult} from './BrowsePathResult';
import {decodeBrowsePathResult} from './BrowsePathResult';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ITranslateBrowsePathsToNodeIdsResponse {
  responseHeader?: ResponseHeader;
  results?: BrowsePathResult[];
  diagnosticInfos?: DiagnosticInfo[];
}

/**

*/

export class TranslateBrowsePathsToNodeIdsResponse {
  responseHeader: ResponseHeader;
  results: BrowsePathResult[];
  diagnosticInfos: DiagnosticInfo[];

 constructor( options?: ITranslateBrowsePathsToNodeIdsResponse) {
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
  this.results = ec.decodeArray(inp, decodeBrowsePathResult);
  this.diagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);

 }


 clone( target?: TranslateBrowsePathsToNodeIdsResponse): TranslateBrowsePathsToNodeIdsResponse {
  if (!target) {
   target = new TranslateBrowsePathsToNodeIdsResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  if (this.results) { target.results = ec.cloneComplexArray(this.results); }
  if (this.diagnosticInfos) { target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos); }
  return target;
 }


}
export function decodeTranslateBrowsePathsToNodeIdsResponse( inp: DataStream): TranslateBrowsePathsToNodeIdsResponse {
  const obj = new TranslateBrowsePathsToNodeIdsResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('TranslateBrowsePathsToNodeIdsResponse', TranslateBrowsePathsToNodeIdsResponse, makeExpandedNodeId(557, 0));
