/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {ConnectionTransportDataType} from './ConnectionTransportDataType';

export interface IBrokerConnectionTransportDataType {
  resourceUri?: string;
  authenticationProfileUri?: string;
}

/**

*/

export class BrokerConnectionTransportDataType extends ConnectionTransportDataType {
  resourceUri: string | null;
  authenticationProfileUri: string | null;

 constructor( options?: IBrokerConnectionTransportDataType) {
  options = options || {};
  super();
  this.resourceUri = (options.resourceUri != null) ? options.resourceUri : null;
  this.authenticationProfileUri = (options.authenticationProfileUri != null) ? options.authenticationProfileUri : null;

 }


 encode( out: DataStream) {
  ec.encodeString(this.resourceUri, out);
  ec.encodeString(this.authenticationProfileUri, out);

 }


 decode( inp: DataStream) {
  this.resourceUri = ec.decodeString(inp);
  this.authenticationProfileUri = ec.decodeString(inp);

 }


 toJSON() {
  const out: any = {};
  out.ResourceUri = this.resourceUri;
  out.AuthenticationProfileUri = this.authenticationProfileUri;
 return out;
 }


 fromJSON( inp: any) {
  this.resourceUri = inp.ResourceUri;
  this.authenticationProfileUri = inp.AuthenticationProfileUri;

 }


 clone( target?: BrokerConnectionTransportDataType): BrokerConnectionTransportDataType {
  if (!target) {
   target = new BrokerConnectionTransportDataType();
  }
  target.resourceUri = this.resourceUri;
  target.authenticationProfileUri = this.authenticationProfileUri;
  return target;
 }


}
export function decodeBrokerConnectionTransportDataType( inp: DataStream): BrokerConnectionTransportDataType {
  const obj = new BrokerConnectionTransportDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('BrokerConnectionTransportDataType', BrokerConnectionTransportDataType, new ExpandedNodeId(2 /*numeric id*/, 15479, 0));
