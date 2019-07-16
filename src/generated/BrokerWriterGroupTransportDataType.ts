

import * as ec from '../basic-types';
import {BrokerTransportQualityOfService, encodeBrokerTransportQualityOfService, decodeBrokerTransportQualityOfService} from './BrokerTransportQualityOfService';
import {DataStream} from '../basic-types/DataStream';
import {WriterGroupTransportDataType} from './WriterGroupTransportDataType';

export interface IBrokerWriterGroupTransportDataType {
  queueName?: string;
  resourceUri?: string;
  authenticationProfileUri?: string;
  requestedDeliveryGuarantee?: BrokerTransportQualityOfService;
}

/**

*/

export class BrokerWriterGroupTransportDataType extends WriterGroupTransportDataType {
  queueName: string;
  resourceUri: string;
  authenticationProfileUri: string;
  requestedDeliveryGuarantee: BrokerTransportQualityOfService;

 constructor( options?: IBrokerWriterGroupTransportDataType) {
  options = options || {};
  super();
  this.queueName = (options.queueName !== undefined) ? options.queueName : null;
  this.resourceUri = (options.resourceUri !== undefined) ? options.resourceUri : null;
  this.authenticationProfileUri = (options.authenticationProfileUri !== undefined) ? options.authenticationProfileUri : null;
  this.requestedDeliveryGuarantee = (options.requestedDeliveryGuarantee !== undefined) ? options.requestedDeliveryGuarantee : null;

 }


 encode( out: DataStream) {
  ec.encodeString(this.queueName, out);
  ec.encodeString(this.resourceUri, out);
  ec.encodeString(this.authenticationProfileUri, out);
  encodeBrokerTransportQualityOfService(this.requestedDeliveryGuarantee, out);

 }


 decode( inp: DataStream) {
  this.queueName = ec.decodeString(inp);
  this.resourceUri = ec.decodeString(inp);
  this.authenticationProfileUri = ec.decodeString(inp);
  this.requestedDeliveryGuarantee = decodeBrokerTransportQualityOfService(inp);

 }


 clone( target?: BrokerWriterGroupTransportDataType): BrokerWriterGroupTransportDataType {
  if (!target) {
   target = new BrokerWriterGroupTransportDataType();
  }
  target.queueName = this.queueName;
  target.resourceUri = this.resourceUri;
  target.authenticationProfileUri = this.authenticationProfileUri;
  target.requestedDeliveryGuarantee = this.requestedDeliveryGuarantee;
  return target;
 }


}
export function decodeBrokerWriterGroupTransportDataType( inp: DataStream): BrokerWriterGroupTransportDataType {
  const obj = new BrokerWriterGroupTransportDataType();
   obj.decode(inp);
   return obj;

 }



