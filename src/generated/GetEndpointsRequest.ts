/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IGetEndpointsRequest {
  requestHeader?: RequestHeader;
  endpointUrl?: string;
  localeIds?: string[];
  profileUris?: string[];
}

/**

*/

export class GetEndpointsRequest {
  requestHeader: RequestHeader;
  endpointUrl: string | null;
  localeIds: string[];
  profileUris: string[];

 constructor( options?: IGetEndpointsRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.endpointUrl = (options.endpointUrl != null) ? options.endpointUrl : null;
  this.localeIds = (options.localeIds != null) ? options.localeIds : [];
  this.profileUris = (options.profileUris != null) ? options.profileUris : [];

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeString(this.endpointUrl, out);
  ec.encodeArray(this.localeIds, out, ec.encodeString);
  ec.encodeArray(this.profileUris, out, ec.encodeString);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.endpointUrl = ec.decodeString(inp);
  this.localeIds = ec.decodeArray(inp, ec.decodeString);
  this.profileUris = ec.decodeArray(inp, ec.decodeString);

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.EndpointUrl = this.endpointUrl;
  out.LocaleIds = this.localeIds;
  out.ProfileUris = this.profileUris;
 return out;
 }


 fromJSON( inp: any) {
  this.requestHeader.fromJSON(inp);
  this.endpointUrl = inp.EndpointUrl;
  this.localeIds = inp.LocaleIds;
  this.profileUris = inp.ProfileUris;

 }


 clone( target?: GetEndpointsRequest): GetEndpointsRequest {
  if (!target) {
   target = new GetEndpointsRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  target.endpointUrl = this.endpointUrl;
  target.localeIds = ec.cloneArray(this.localeIds);
  target.profileUris = ec.cloneArray(this.profileUris);
  return target;
 }


}
export function decodeGetEndpointsRequest( inp: DataStream): GetEndpointsRequest {
  const obj = new GetEndpointsRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('GetEndpointsRequest', GetEndpointsRequest, new ExpandedNodeId(2 /*numeric id*/, 428, 0));
