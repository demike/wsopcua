/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {ResponseHeader} from './ResponseHeader';
import {EndpointDescription} from './EndpointDescription';
import {decodeEndpointDescription} from './EndpointDescription';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IGetEndpointsResponse {
  responseHeader?: ResponseHeader;
  endpoints?: EndpointDescription[];
}

/**

*/

export class GetEndpointsResponse {
  responseHeader: ResponseHeader;
  endpoints: EndpointDescription[];

 constructor( options?: IGetEndpointsResponse) {
  options = options || {};
  this.responseHeader = (options.responseHeader != null) ? options.responseHeader : new ResponseHeader();
  this.endpoints = (options.endpoints != null) ? options.endpoints : [];

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);
  ec.encodeArray(this.endpoints, out);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);
  this.endpoints = ec.decodeArray(inp, decodeEndpointDescription);

 }


 toJSON() {
  const out: any = {};
  out.ResponseHeader = this.responseHeader;
  out.Endpoints = this.endpoints;
 return out;
 }


 fromJSON( inp: any) {
  this.responseHeader.fromJSON(inp);
  this.endpoints = inp.Endpoints.map(m => { const mem = new EndpointDescription(); mem.fromJSON(m); return mem;});

 }


 clone( target?: GetEndpointsResponse): GetEndpointsResponse {
  if (!target) {
   target = new GetEndpointsResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  if (this.endpoints) { target.endpoints = ec.cloneComplexArray(this.endpoints); }
  return target;
 }


}
export function decodeGetEndpointsResponse( inp: DataStream): GetEndpointsResponse {
  const obj = new GetEndpointsResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('GetEndpointsResponse', GetEndpointsResponse, new ExpandedNodeId(2 /*numeric id*/, 431, 0));
