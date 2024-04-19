/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import {RegisteredServer} from './RegisteredServer';
import {ExtensionObject, encodeExtensionObject, decodeExtensionObject, jsonEncodeExtensionObject, jsonDecodeExtensionObject} from '../basic-types/extension_object';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IRegisterServer2Request = Partial<RegisterServer2Request>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16044}
*/

export class RegisterServer2Request {
  requestHeader: RequestHeader;
  server: RegisteredServer;
  discoveryConfiguration: (ExtensionObject | null)[];

 constructor( options?: IRegisterServer2Request | null) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.server = (options.server != null) ? options.server : new RegisteredServer();
  this.discoveryConfiguration = (options.discoveryConfiguration != null) ? options.discoveryConfiguration : [];

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  this.server.encode(out);
  ec.encodeArray(this.discoveryConfiguration, out, encodeExtensionObject);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.server.decode(inp);
  this.discoveryConfiguration = ec.decodeArray(inp, decodeExtensionObject) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.Server = this.server;
  out.DiscoveryConfiguration = ec.jsonEncodeArray(this.discoveryConfiguration, jsonEncodeExtensionObject);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);
  this.server.fromJSON(inp.Server);
  this.discoveryConfiguration = ec.jsonDecodeArray( inp.DiscoveryConfiguration, jsonDecodeExtensionObject);

 }


 clone( target?: RegisterServer2Request): RegisterServer2Request {
  if (!target) {
   target = new RegisterServer2Request();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  if (this.server) { target.server = this.server.clone(); }
  target.discoveryConfiguration = ec.cloneArray(this.discoveryConfiguration);
  return target;
 }


}
export function decodeRegisterServer2Request( inp: DataStream): RegisterServer2Request {
  const obj = new RegisterServer2Request();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('RegisterServer2Request', RegisterServer2Request, new ExpandedNodeId(2 /*numeric id*/, 12211, 0));
