/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ISessionlessInvokeRequestType {
  urisVersion?: ec.UInt32[];
  namespaceUris?: string[];
  serverUris?: string[];
  localeIds?: string[];
  serviceId?: ec.UInt32;
}

/**

*/

export class SessionlessInvokeRequestType {
  urisVersion: ec.UInt32[];
  namespaceUris: string[];
  serverUris: string[];
  localeIds: string[];
  serviceId: ec.UInt32;

 constructor( options?: ISessionlessInvokeRequestType) {
  options = options || {};
  this.urisVersion = (options.urisVersion != null) ? options.urisVersion : [];
  this.namespaceUris = (options.namespaceUris != null) ? options.namespaceUris : [];
  this.serverUris = (options.serverUris != null) ? options.serverUris : [];
  this.localeIds = (options.localeIds != null) ? options.localeIds : [];
  this.serviceId = (options.serviceId != null) ? options.serviceId : 0;

 }


 encode( out: DataStream) {
  ec.encodeArray(this.urisVersion, out, ec.encodeUInt32);
  ec.encodeArray(this.namespaceUris, out, ec.encodeString);
  ec.encodeArray(this.serverUris, out, ec.encodeString);
  ec.encodeArray(this.localeIds, out, ec.encodeString);
  ec.encodeUInt32(this.serviceId, out);

 }


 decode( inp: DataStream) {
  this.urisVersion = ec.decodeArray(inp, ec.decodeUInt32);
  this.namespaceUris = ec.decodeArray(inp, ec.decodeString);
  this.serverUris = ec.decodeArray(inp, ec.decodeString);
  this.localeIds = ec.decodeArray(inp, ec.decodeString);
  this.serviceId = ec.decodeUInt32(inp);

 }


 toJSON() {
  const out: any = {};
  out.UrisVersion = this.urisVersion;
  out.NamespaceUris = this.namespaceUris;
  out.ServerUris = this.serverUris;
  out.LocaleIds = this.localeIds;
  out.ServiceId = this.serviceId;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.urisVersion = inp.UrisVersion;
  this.namespaceUris = inp.NamespaceUris;
  this.serverUris = inp.ServerUris;
  this.localeIds = inp.LocaleIds;
  this.serviceId = inp.ServiceId;

 }


 clone( target?: SessionlessInvokeRequestType): SessionlessInvokeRequestType {
  if (!target) {
   target = new SessionlessInvokeRequestType();
  }
  target.urisVersion = ec.cloneArray(this.urisVersion);
  target.namespaceUris = ec.cloneArray(this.namespaceUris);
  target.serverUris = ec.cloneArray(this.serverUris);
  target.localeIds = ec.cloneArray(this.localeIds);
  target.serviceId = this.serviceId;
  return target;
 }


}
export function decodeSessionlessInvokeRequestType( inp: DataStream): SessionlessInvokeRequestType {
  const obj = new SessionlessInvokeRequestType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('SessionlessInvokeRequestType', SessionlessInvokeRequestType, new ExpandedNodeId(2 /*numeric id*/, 15903, 0));
