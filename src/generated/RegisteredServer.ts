/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {LocalizedText} from './LocalizedText';
import {decodeLocalizedText} from './LocalizedText';
import {ApplicationType, encodeApplicationType, decodeApplicationType} from './ApplicationType';
import {DataStream} from '../basic-types/DataStream';

export type IRegisteredServer = Partial<RegisteredServer>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16039}
*/

export class RegisteredServer {
  serverUri: string | undefined;
  productUri: string | undefined;
  serverNames: (LocalizedText)[];
  serverType: ApplicationType;
  gatewayServerUri: string | undefined;
  discoveryUrls: (string | undefined)[];
  semaphoreFilePath: string | undefined;
  isOnline: boolean;

 constructor( options?: IRegisteredServer | undefined) {
  options = options || {};
  this.serverUri = options.serverUri;
  this.productUri = options.productUri;
  this.serverNames = (options.serverNames != null) ? options.serverNames : [];
  this.serverType = (options.serverType != null) ? options.serverType : ApplicationType.Invalid;
  this.gatewayServerUri = options.gatewayServerUri;
  this.discoveryUrls = (options.discoveryUrls != null) ? options.discoveryUrls : [];
  this.semaphoreFilePath = options.semaphoreFilePath;
  this.isOnline = (options.isOnline != null) ? options.isOnline : false;

 }


 encode( out: DataStream) {
  ec.encodeString(this.serverUri, out);
  ec.encodeString(this.productUri, out);
  ec.encodeArray(this.serverNames, out);
  encodeApplicationType(this.serverType, out);
  ec.encodeString(this.gatewayServerUri, out);
  ec.encodeArray(this.discoveryUrls, out, ec.encodeString);
  ec.encodeString(this.semaphoreFilePath, out);
  ec.encodeBoolean(this.isOnline, out);

 }


 decode( inp: DataStream) {
  this.serverUri = ec.decodeString(inp);
  this.productUri = ec.decodeString(inp);
  this.serverNames = ec.decodeArray(inp, decodeLocalizedText) ?? [];
  this.serverType = decodeApplicationType(inp);
  this.gatewayServerUri = ec.decodeString(inp);
  this.discoveryUrls = ec.decodeArray(inp, ec.decodeString) ?? [];
  this.semaphoreFilePath = ec.decodeString(inp);
  this.isOnline = ec.decodeBoolean(inp);

 }


 toJSON() {
  const out: any = {};
  out.ServerUri = this.serverUri;
  out.ProductUri = this.productUri;
  out.ServerNames = this.serverNames;
  out.ServerType = this.serverType;
  out.GatewayServerUri = this.gatewayServerUri;
  out.DiscoveryUrls = this.discoveryUrls;
  out.SemaphoreFilePath = this.semaphoreFilePath;
  out.IsOnline = this.isOnline;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.serverUri = inp.ServerUri;
  this.productUri = inp.ProductUri;
  this.serverNames = ec.jsonDecodeStructArray( inp.ServerNames,LocalizedText);
  this.serverType = inp.ServerType;
  this.gatewayServerUri = inp.GatewayServerUri;
  this.discoveryUrls = inp.DiscoveryUrls;
  this.semaphoreFilePath = inp.SemaphoreFilePath;
  this.isOnline = inp.IsOnline;

 }


 clone( target?: RegisteredServer): RegisteredServer {
  if (!target) {
   target = new RegisteredServer();
  }
  target.serverUri = this.serverUri;
  target.productUri = this.productUri;
  if (this.serverNames) { target.serverNames = ec.cloneComplexArray(this.serverNames); }
  target.serverType = this.serverType;
  target.gatewayServerUri = this.gatewayServerUri;
  target.discoveryUrls = ec.cloneArray(this.discoveryUrls);
  target.semaphoreFilePath = this.semaphoreFilePath;
  target.isOnline = this.isOnline;
  return target;
 }


}
export function decodeRegisteredServer( inp: DataStream): RegisteredServer {
  const obj = new RegisteredServer();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('RegisteredServer', RegisteredServer, new ExpandedNodeId(2 /*numeric id*/, 434, 0));
