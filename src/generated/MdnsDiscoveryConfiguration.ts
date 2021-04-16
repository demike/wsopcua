/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types';
import {DiscoveryConfiguration} from '.';

export interface IMdnsDiscoveryConfiguration {
  mdnsServerName?: string;
  serverCapabilities?: string[];
}

/**

*/

export class MdnsDiscoveryConfiguration extends DiscoveryConfiguration {
  mdnsServerName: string | null;
  serverCapabilities: string[];

 constructor( options?: IMdnsDiscoveryConfiguration) {
  options = options || {};
  super();
  this.mdnsServerName = (options.mdnsServerName != null) ? options.mdnsServerName : null;
  this.serverCapabilities = (options.serverCapabilities != null) ? options.serverCapabilities : [];

 }


 encode( out: DataStream) {
  ec.encodeString(this.mdnsServerName, out);
  ec.encodeArray(this.serverCapabilities, out, ec.encodeString);

 }


 decode( inp: DataStream) {
  this.mdnsServerName = ec.decodeString(inp);
  this.serverCapabilities = ec.decodeArray(inp, ec.decodeString);

 }


 toJSON() {
  const out: any = {};
  out.MdnsServerName = this.mdnsServerName;
  out.ServerCapabilities = this.serverCapabilities;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.mdnsServerName = inp.MdnsServerName;
  this.serverCapabilities = inp.ServerCapabilities;

 }


 clone( target?: MdnsDiscoveryConfiguration): MdnsDiscoveryConfiguration {
  if (!target) {
   target = new MdnsDiscoveryConfiguration();
  }
  target.mdnsServerName = this.mdnsServerName;
  target.serverCapabilities = ec.cloneArray(this.serverCapabilities);
  return target;
 }


}
export function decodeMdnsDiscoveryConfiguration( inp: DataStream): MdnsDiscoveryConfiguration {
  const obj = new MdnsDiscoveryConfiguration();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory';
import { ExpandedNodeId } from '../nodeid';
register_class_definition('MdnsDiscoveryConfiguration', MdnsDiscoveryConfiguration, new ExpandedNodeId(2 /*numeric id*/, 12901, 0));
