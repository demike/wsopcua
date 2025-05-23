/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {ResponseHeader} from './ResponseHeader';
import {AddNodesResult} from './AddNodesResult';
import {decodeAddNodesResult} from './AddNodesResult';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IAddNodesResponse = Partial<AddNodesResponse>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16085}
*/

export class AddNodesResponse {
  responseHeader: ResponseHeader;
  results: (AddNodesResult)[];
  diagnosticInfos: (DiagnosticInfo)[];

 constructor( options?: IAddNodesResponse | undefined) {
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
  this.results = ec.decodeArray(inp, decodeAddNodesResult) ?? [];
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
  this.results = ec.jsonDecodeStructArray( inp.Results,AddNodesResult);
  this.diagnosticInfos = ec.jsonDecodeStructArray( inp.DiagnosticInfos,DiagnosticInfo);

 }


 clone( target?: AddNodesResponse): AddNodesResponse {
  if (!target) {
   target = new AddNodesResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  if (this.results) { target.results = ec.cloneComplexArray(this.results); }
  if (this.diagnosticInfos) { target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos); }
  return target;
 }


}
export function decodeAddNodesResponse( inp: DataStream): AddNodesResponse {
  const obj = new AddNodesResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('AddNodesResponse', AddNodesResponse, new ExpandedNodeId(2 /*numeric id*/, 491, 0));
