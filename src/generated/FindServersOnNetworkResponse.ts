/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {ResponseHeader} from './ResponseHeader';
import * as ec from '../basic-types';
import {ServerOnNetwork} from './ServerOnNetwork';
import {decodeServerOnNetwork} from './ServerOnNetwork';
import {DataStream} from '../basic-types/DataStream';

export interface IFindServersOnNetworkResponse {
  responseHeader?: ResponseHeader;
  lastCounterResetTime?: Date;
  servers?: ServerOnNetwork[];
}

/**

*/

export class FindServersOnNetworkResponse {
  responseHeader: ResponseHeader;
  lastCounterResetTime: Date;
  servers: ServerOnNetwork[];

 constructor( options?: IFindServersOnNetworkResponse) {
  options = options || {};
  this.responseHeader = (options.responseHeader != null) ? options.responseHeader : new ResponseHeader();
  this.lastCounterResetTime = (options.lastCounterResetTime != null) ? options.lastCounterResetTime : new Date();
  this.servers = (options.servers != null) ? options.servers : [];

 }


 encode( out: DataStream) {
  this.responseHeader.encode(out);
  ec.encodeDateTime(this.lastCounterResetTime, out);
  ec.encodeArray(this.servers, out);

 }


 decode( inp: DataStream) {
  this.responseHeader.decode(inp);
  this.lastCounterResetTime = ec.decodeDateTime(inp);
  this.servers = ec.decodeArray(inp, decodeServerOnNetwork);

 }


 clone( target?: FindServersOnNetworkResponse): FindServersOnNetworkResponse {
  if (!target) {
   target = new FindServersOnNetworkResponse();
  }
  if (this.responseHeader) { target.responseHeader = this.responseHeader.clone(); }
  target.lastCounterResetTime = this.lastCounterResetTime;
  if (this.servers) { target.servers = ec.cloneComplexArray(this.servers); }
  return target;
 }


}
export function decodeFindServersOnNetworkResponse( inp: DataStream): FindServersOnNetworkResponse {
  const obj = new FindServersOnNetworkResponse();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('FindServersOnNetworkResponse', FindServersOnNetworkResponse, new ExpandedNodeId(2 /*numeric id*/, 12209, 0));
