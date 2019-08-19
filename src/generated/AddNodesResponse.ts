

import {ResponseHeader} from './ResponseHeader';
import {AddNodesResult} from './AddNodesResult';
import {decodeAddNodesResult} from './AddNodesResult';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IAddNodesResponse {
  responseHeader?: ResponseHeader;
  results?: AddNodesResult[];
  diagnosticInfos?: DiagnosticInfo[];
}

/**

*/

export class AddNodesResponse {
  responseHeader: ResponseHeader;
  results: AddNodesResult[];
  diagnosticInfos: DiagnosticInfo[];

 constructor( options?: IAddNodesResponse) {
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
  this.results = ec.decodeArray(inp, decodeAddNodesResult);
  this.diagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('AddNodesResponse', AddNodesResponse, makeExpandedNodeId(491, 0));
