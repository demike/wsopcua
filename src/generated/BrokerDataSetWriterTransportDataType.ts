/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

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

 * {@link https://reference.opcfoundation.org/nodesets/4/15840}
*/

export class BrokerDataSetWriterTransportDataType extends DataSetWriterTransportDataType {
  queueName: string | null;
  resourceUri: string | null;
  authenticationProfileUri: string | null;
  requestedDeliveryGuarantee: BrokerTransportQualityOfService;
  metaDataQueueName: string | null;
  metaDataUpdateTime: ec.Double;

 constructor( options?: IBrokerDataSetWriterTransportDataType) {
  options = options || {};
  super();
  this.queueName = (options.queueName != null) ? options.queueName : null;
  this.resourceUri = (options.resourceUri != null) ? options.resourceUri : null;
  this.authenticationProfileUri = (options.authenticationProfileUri != null) ? options.authenticationProfileUri : null;
  this.requestedDeliveryGuarantee = (options.requestedDeliveryGuarantee != null) ? options.requestedDeliveryGuarantee : null;
  this.metaDataQueueName = (options.metaDataQueueName != null) ? options.metaDataQueueName : null;
  this.metaDataUpdateTime = (options.metaDataUpdateTime != null) ? options.metaDataUpdateTime : 0;

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


 toJSON() {
  const out: any = {};
  out.QueueName = this.queueName;
  out.ResourceUri = this.resourceUri;
  out.AuthenticationProfileUri = this.authenticationProfileUri;
  out.RequestedDeliveryGuarantee = this.requestedDeliveryGuarantee;
  out.MetaDataQueueName = this.metaDataQueueName;
  out.MetaDataUpdateTime = this.metaDataUpdateTime;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.queueName = inp.QueueName;
  this.resourceUri = inp.ResourceUri;
  this.authenticationProfileUri = inp.AuthenticationProfileUri;
  this.requestedDeliveryGuarantee = inp.RequestedDeliveryGuarantee;
  this.metaDataQueueName = inp.MetaDataQueueName;
  this.metaDataUpdateTime = inp.MetaDataUpdateTime;

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



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('BrokerDataSetWriterTransportDataType', BrokerDataSetWriterTransportDataType, new ExpandedNodeId(2 /*numeric id*/, 15729, 0));
