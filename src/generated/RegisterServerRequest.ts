/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import {RegisteredServer} from './RegisteredServer';
import {DataStream} from '../basic-types/DataStream';

export type IRegisterServerRequest = Partial<RegisterServerRequest>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16040}
*/

export class RegisterServerRequest {
  requestHeader: RequestHeader;
  server: RegisteredServer;

 constructor( options?: IRegisterServerRequest | null) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.server = (options.server != null) ? options.server : new RegisteredServer();

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  this.server.encode(out);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.server.decode(inp);

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.Server = this.server;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);
  this.server.fromJSON(inp.Server);

 }


 clone( target?: RegisterServerRequest): RegisterServerRequest {
  if (!target) {
   target = new RegisterServerRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  if (this.server) { target.server = this.server.clone(); }
  return target;
 }


}
export function decodeRegisterServerRequest( inp: DataStream): RegisterServerRequest {
  const obj = new RegisterServerRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('RegisterServerRequest', RegisterServerRequest, new ExpandedNodeId(2 /*numeric id*/, 437, 0));
