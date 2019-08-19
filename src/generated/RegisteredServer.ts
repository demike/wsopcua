

import * as ec from '../basic-types';
import {LocalizedText} from './LocalizedText';
import {decodeLocalizedText} from './LocalizedText';
import {ApplicationType, encodeApplicationType, decodeApplicationType} from './ApplicationType';
import {DataStream} from '../basic-types/DataStream';

export interface IRegisteredServer {
  serverUri?: string;
  productUri?: string;
  serverNames?: LocalizedText[];
  serverType?: ApplicationType;
  gatewayServerUri?: string;
  discoveryUrls?: string[];
  semaphoreFilePath?: string;
  isOnline?: boolean;
}

/**

*/

export class RegisteredServer {
  serverUri: string;
  productUri: string;
  serverNames: LocalizedText[];
  serverType: ApplicationType;
  gatewayServerUri: string;
  discoveryUrls: string[];
  semaphoreFilePath: string;
  isOnline: boolean;

 constructor( options?: IRegisteredServer) {
  options = options || {};
  this.serverUri = (options.serverUri != null) ? options.serverUri : null;
  this.productUri = (options.productUri != null) ? options.productUri : null;
  this.serverNames = (options.serverNames != null) ? options.serverNames : [];
  this.serverType = (options.serverType != null) ? options.serverType : null;
  this.gatewayServerUri = (options.gatewayServerUri != null) ? options.gatewayServerUri : null;
  this.discoveryUrls = (options.discoveryUrls != null) ? options.discoveryUrls : [];
  this.semaphoreFilePath = (options.semaphoreFilePath != null) ? options.semaphoreFilePath : null;
  this.isOnline = (options.isOnline != null) ? options.isOnline : null;

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
  this.serverNames = ec.decodeArray(inp, decodeLocalizedText);
  this.serverType = decodeApplicationType(inp);
  this.gatewayServerUri = ec.decodeString(inp);
  this.discoveryUrls = ec.decodeArray(inp, ec.decodeString);
  this.semaphoreFilePath = ec.decodeString(inp);
  this.isOnline = ec.decodeBoolean(inp);

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('RegisteredServer', RegisteredServer, makeExpandedNodeId(434, 0));
