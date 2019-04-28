

import {ResponseHeader} from './ResponseHeader';
import * as ec from '../basic-types';
import {DiagnosticInfo} from './DiagnosticInfo';
import {decodeDiagnosticInfo} from './DiagnosticInfo';
import {DataStream} from '../basic-types/DataStream';

export interface IRegisterServer2Response {
  responseHeader?: ResponseHeader;
  configurationResults?: ec.StatusCode[];
  diagnosticInfos?: DiagnosticInfo[];
}

/**

*/

export class RegisterServer2Response {
  responseHeader: ResponseHeader;
  configurationResults: ec.StatusCode[];
  diagnosticInfos: DiagnosticInfo[];

 constructor( options?: IRegisterServer2Response) {
  options = options || {};
  this.responseHeader = (options.responseHeader) ? options.responseHeader : new ResponseHeader();
  this.configurationResults = (options.configurationResults) ? options.configurationResults : [];
  this.diagnosticInfos = (options.diagnosticInfos) ? options.diagnosticInfos : [];

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);
  ec.encodeArray(this.configurationResults, out, ec.encodeStatusCode);
  ec.encodeArray(this.diagnosticInfos, out);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);
  this.configurationResults = ec.decodeArray(inp, ec.decodeStatusCode);
  this.diagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);

 }


 clone( target?: RegisterServer2Response): RegisterServer2Response {
  if (!target) {
   target = new RegisterServer2Response();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  target.configurationResults = ec.cloneArray(this.configurationResults);
  if (this.diagnosticInfos) { target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos); }
  return target;
 }


}
export function decodeRegisterServer2Response( inp: DataStream): RegisterServer2Response {
  const obj = new RegisterServer2Response();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('RegisterServer2Response', RegisterServer2Response, makeExpandedNodeId(12212, 0));
