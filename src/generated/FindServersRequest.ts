/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IFindServersRequest = Partial<FindServersRequest>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16027}
*/

export class FindServersRequest {
  requestHeader: RequestHeader;
  endpointUrl: string | undefined;
  localeIds: (string | undefined)[];
  serverUris: (string | undefined)[];

 constructor( options?: IFindServersRequest | undefined) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.endpointUrl = options.endpointUrl;
  this.localeIds = (options.localeIds != null) ? options.localeIds : [];
  this.serverUris = (options.serverUris != null) ? options.serverUris : [];

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  ec.encodeString(this.endpointUrl, out);
  ec.encodeArray(this.localeIds, out, ec.encodeString);
  ec.encodeArray(this.serverUris, out, ec.encodeString);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.endpointUrl = ec.decodeString(inp);
  this.localeIds = ec.decodeArray(inp, ec.decodeString) ?? [];
  this.serverUris = ec.decodeArray(inp, ec.decodeString) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.EndpointUrl = this.endpointUrl;
  out.LocaleIds = this.localeIds;
  out.ServerUris = this.serverUris;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);
  this.endpointUrl = inp.EndpointUrl;
  this.localeIds = inp.LocaleIds;
  this.serverUris = inp.ServerUris;

 }


 clone( target?: FindServersRequest): FindServersRequest {
  if (!target) {
   target = new FindServersRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  target.endpointUrl = this.endpointUrl;
  target.localeIds = ec.cloneArray(this.localeIds);
  target.serverUris = ec.cloneArray(this.serverUris);
  return target;
 }


}
export function decodeFindServersRequest( inp: DataStream): FindServersRequest {
  const obj = new FindServersRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('FindServersRequest', FindServersRequest, new ExpandedNodeId(2 /*numeric id*/, 422, 0));
