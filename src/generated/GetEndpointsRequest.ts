

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
Gets the endpoints used by the server.
*/

export class GetEndpointsRequest {
  requestHeader: RequestHeader;
  endpointUrl: string;
  localeIds: string[];
  profileUris: string[];

 constructor( options?: IGetEndpointsRequest) {
  options = options || {};
  this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
  this.endpointUrl = (options.endpointUrl) ? options.endpointUrl : null;
  this.localeIds = (options.localeIds) ? options.localeIds : [];
  this.profileUris = (options.profileUris) ? options.profileUris : [];

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('GetEndpointsRequest', GetEndpointsRequest, makeExpandedNodeId(428, 0));
