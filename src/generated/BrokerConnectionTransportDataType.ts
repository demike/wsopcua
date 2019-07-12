

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
  resourceUri: string;
  authenticationProfileUri: string;

 constructor( options?: IBrokerConnectionTransportDataType) {
  options = options || {};
  super();
  this.resourceUri = (options.resourceUri) ? options.resourceUri : null;
  this.authenticationProfileUri = (options.authenticationProfileUri) ? options.authenticationProfileUri : null;

 }


 encode( out: DataStream) {
  ec.encodeString(this.resourceUri, out);
  ec.encodeString(this.authenticationProfileUri, out);

 }


 decode( inp: DataStream) {
  this.resourceUri = ec.decodeString(inp);
  this.authenticationProfileUri = ec.decodeString(inp);

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



