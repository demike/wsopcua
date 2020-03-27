/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {ResponseHeader} from './ResponseHeader';
import {ApplicationDescription} from './ApplicationDescription';
import {decodeApplicationDescription} from './ApplicationDescription';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IFindServersResponse {
  responseHeader?: ResponseHeader;
  servers?: ApplicationDescription[];
}

/**

*/

export class FindServersResponse {
  responseHeader: ResponseHeader;
  servers: ApplicationDescription[];

 constructor( options?: IFindServersResponse) {
  options = options || {};
  this.responseHeader = (options.responseHeader != null) ? options.responseHeader : new ResponseHeader();
  this.servers = (options.servers != null) ? options.servers : [];

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);
  ec.encodeArray(this.servers, out);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);
  this.servers = ec.decodeArray(inp, decodeApplicationDescription);

 }


 toJSON() {
  const out: any = {};
  out.ResponseHeader = this.responseHeader;
  out.Servers = this.servers;
 return out;
 }


 fromJSON( inp: any) {
  this.responseHeader.fromJSON(inp);
  this.servers = inp.Servers.map(m => { const mem = new ApplicationDescription(); mem.fromJSON(m); return mem;});

 }


 clone( target?: FindServersResponse): FindServersResponse {
  if (!target) {
   target = new FindServersResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  if (this.servers) { target.servers = ec.cloneComplexArray(this.servers); }
  return target;
 }


}
export function decodeFindServersResponse( inp: DataStream): FindServersResponse {
  const obj = new FindServersResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('FindServersResponse', FindServersResponse, new ExpandedNodeId(2 /*numeric id*/, 425, 0));
