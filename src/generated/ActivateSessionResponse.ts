

import {ResponseHeader} from './ResponseHeader';
import * as ec from '../basic-types';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import {DataStream} from '../basic-types/DataStream';

export interface IActivateSessionResponse {
  responseHeader?: ResponseHeader;
  serverNonce?: Uint8Array;
  results?: ec.StatusCode[];
  diagnosticInfos?: DiagnosticInfo[];
}

/**

*/

export class ActivateSessionResponse {
  responseHeader: ResponseHeader;
  serverNonce: Uint8Array;
  results: ec.StatusCode[];
  diagnosticInfos: DiagnosticInfo[];

 constructor( options?: IActivateSessionResponse) {
  options = options || {};
  this.responseHeader = (options.responseHeader !== undefined) ? options.responseHeader : new ResponseHeader();
  this.serverNonce = (options.serverNonce !== undefined) ? options.serverNonce : null;
  this.results = (options.results !== undefined) ? options.results : [];
  this.diagnosticInfos = (options.diagnosticInfos !== undefined) ? options.diagnosticInfos : [];

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);
  ec.encodeByteString(this.serverNonce, out);
  ec.encodeArray(this.results, out, ec.encodeStatusCode);
  ec.encodeArray(this.diagnosticInfos, out);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);
  this.serverNonce = ec.decodeByteString(inp);
  this.results = ec.decodeArray(inp, ec.decodeStatusCode);
  this.diagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);

 }


 clone( target?: ActivateSessionResponse): ActivateSessionResponse {
  if (!target) {
   target = new ActivateSessionResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  target.serverNonce = this.serverNonce;
  target.results = ec.cloneArray(this.results);
  if (this.diagnosticInfos) { target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos); }
  return target;
 }


}
export function decodeActivateSessionResponse( inp: DataStream): ActivateSessionResponse {
  const obj = new ActivateSessionResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ActivateSessionResponse', ActivateSessionResponse, makeExpandedNodeId(470, 0));
