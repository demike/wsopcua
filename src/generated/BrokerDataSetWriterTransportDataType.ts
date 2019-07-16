

import * as ec from '../basic-types';
import {BrokerTransportQualityOfService, encodeBrokerTransportQualityOfService, decodeBrokerTransportQualityOfService} from './BrokerTransportQualityOfService';
import {DataStream} from '../basic-types/DataStream';
import {DataSetWriterTransportDataType} from './DataSetWriterTransportDataType';

export interface IBrokerDataSetWriterTransportDataType {
  queueName?: string;
  resourceUri?: string;
  authenticationProfileUri?: string;
  requestedDeliveryGuarantee?: BrokerTransportQualityOfService;
  metaDataQueueName?: string;
  metaDataUpdateTime?: ec.Double;
}

/**

*/

export class BrokerDataSetWriterTransportDataType extends DataSetWriterTransportDataType {
  queueName: string;
  resourceUri: string;
  authenticationProfileUri: string;
  requestedDeliveryGuarantee: BrokerTransportQualityOfService;
  metaDataQueueName: string;
  metaDataUpdateTime: ec.Double;

 constructor( options?: IBrokerDataSetWriterTransportDataType) {
  options = options || {};
  super();
  this.queueName = (options.queueName !== undefined) ? options.queueName : null;
  this.resourceUri = (options.resourceUri !== undefined) ? options.resourceUri : null;
  this.authenticationProfileUri = (options.authenticationProfileUri !== undefined) ? options.authenticationProfileUri : null;
  this.requestedDeliveryGuarantee = (options.requestedDeliveryGuarantee !== undefined) ? options.requestedDeliveryGuarantee : null;
  this.metaDataQueueName = (options.metaDataQueueName !== undefined) ? options.metaDataQueueName : null;
  this.metaDataUpdateTime = (options.metaDataUpdateTime !== undefined) ? options.metaDataUpdateTime : null;

 }


 encode( out: DataStream) {
  ec.encodeString(this.queueName, out);
  ec.encodeString(this.resourceUri, out);
  ec.encodeString(this.authenticationProfileUri, out);
  encodeBrokerTransportQualityOfService(this.requestedDeliveryGuarantee, out);
  ec.encodeString(this.metaDataQueueName, out);
  ec.encodeDouble(this.metaDataUpdateTime, out);

 }


 decode( inp: DataStream) {
  this.queueName = ec.decodeString(inp);
  this.resourceUri = ec.decodeString(inp);
  this.authenticationProfileUri = ec.decodeString(inp);
  this.requestedDeliveryGuarantee = decodeBrokerTransportQualityOfService(inp);
  this.metaDataQueueName = ec.decodeString(inp);
  this.metaDataUpdateTime = ec.decodeDouble(inp);

 }


 clone( target?: BrokerDataSetWriterTransportDataType): BrokerDataSetWriterTransportDataType {
  if (!target) {
   target = new BrokerDataSetWriterTransportDataType();
  }
  target.queueName = this.queueName;
  target.resourceUri = this.resourceUri;
  target.authenticationProfileUri = this.authenticationProfileUri;
  target.requestedDeliveryGuarantee = this.requestedDeliveryGuarantee;
  target.metaDataQueueName = this.metaDataQueueName;
  target.metaDataUpdateTime = this.metaDataUpdateTime;
  return target;
 }


}
export function decodeBrokerDataSetWriterTransportDataType( inp: DataStream): BrokerDataSetWriterTransportDataType {
  const obj = new BrokerDataSetWriterTransportDataType();
   obj.decode(inp);
   return obj;

 }



