/** generated by wsopcua data type generator 
 do not modify, changes will be overwritten 
 */

import * as ec from '../basic-types';
import {BrokerTransportQualityOfService, encodeBrokerTransportQualityOfService, decodeBrokerTransportQualityOfService} from './BrokerTransportQualityOfService';
import {DataStream} from '../basic-types/DataStream';
import {DataSetReaderTransportDataType} from './DataSetReaderTransportDataType';

export interface IBrokerDataSetReaderTransportDataType {
  queueName?: string;
  resourceUri?: string;
  authenticationProfileUri?: string;
  requestedDeliveryGuarantee?: BrokerTransportQualityOfService;
  metaDataQueueName?: string;
}

/**

*/

export class BrokerDataSetReaderTransportDataType extends DataSetReaderTransportDataType {
  queueName: string | null;
  resourceUri: string | null;
  authenticationProfileUri: string | null;
  requestedDeliveryGuarantee: BrokerTransportQualityOfService;
  metaDataQueueName: string | null;

 constructor( options?: IBrokerDataSetReaderTransportDataType) {
  options = options || {};
  super();
  this.queueName = (options.queueName != null) ? options.queueName : null;
  this.resourceUri = (options.resourceUri != null) ? options.resourceUri : null;
  this.authenticationProfileUri = (options.authenticationProfileUri != null) ? options.authenticationProfileUri : null;
  this.requestedDeliveryGuarantee = (options.requestedDeliveryGuarantee != null) ? options.requestedDeliveryGuarantee : null;
  this.metaDataQueueName = (options.metaDataQueueName != null) ? options.metaDataQueueName : null;

 }


 encode( out: DataStream) {
  ec.encodeString(this.queueName, out);
  ec.encodeString(this.resourceUri, out);
  ec.encodeString(this.authenticationProfileUri, out);
  encodeBrokerTransportQualityOfService(this.requestedDeliveryGuarantee, out);
  ec.encodeString(this.metaDataQueueName, out);

 }


 decode( inp: DataStream) {
  this.queueName = ec.decodeString(inp);
  this.resourceUri = ec.decodeString(inp);
  this.authenticationProfileUri = ec.decodeString(inp);
  this.requestedDeliveryGuarantee = decodeBrokerTransportQualityOfService(inp);
  this.metaDataQueueName = ec.decodeString(inp);

 }


 clone( target?: BrokerDataSetReaderTransportDataType): BrokerDataSetReaderTransportDataType {
  if (!target) {
   target = new BrokerDataSetReaderTransportDataType();
  }
  target.queueName = this.queueName;
  target.resourceUri = this.resourceUri;
  target.authenticationProfileUri = this.authenticationProfileUri;
  target.requestedDeliveryGuarantee = this.requestedDeliveryGuarantee;
  target.metaDataQueueName = this.metaDataQueueName;
  return target;
 }


}
export function decodeBrokerDataSetReaderTransportDataType( inp: DataStream): BrokerDataSetReaderTransportDataType {
  const obj = new BrokerDataSetReaderTransportDataType();
   obj.decode(inp);
   return obj;

 }



