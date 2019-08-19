

import {RequestHeader} from './RequestHeader';
import {RegisteredServer} from './RegisteredServer';
import {DataStream} from '../basic-types/DataStream';

export interface IRegisterServerRequest {
  requestHeader?: RequestHeader;
  server?: RegisteredServer;
}

/**

*/

export class RegisterServerRequest {
  requestHeader: RequestHeader;
  server: RegisteredServer;

 constructor( options?: IRegisterServerRequest) {
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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('RegisterServerRequest', RegisterServerRequest, makeExpandedNodeId(437, 0));
