/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {BrokerTransportQualityOfService, encodeBrokerTransportQualityOfService, decodeBrokerTransportQualityOfService} from './BrokerTransportQualityOfService';
import {DataStream} from '../basic-types/DataStream';
import {WriterGroupTransportDataType} from './WriterGroupTransportDataType';

export type IBrokerWriterGroupTransportDataType = Partial<BrokerWriterGroupTransportDataType>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15839}
*/

export class BrokerWriterGroupTransportDataType extends WriterGroupTransportDataType {
  queueName: string | undefined;
  resourceUri: string | undefined;
  authenticationProfileUri: string | undefined;
  requestedDeliveryGuarantee: BrokerTransportQualityOfService;

 constructor( options?: IBrokerWriterGroupTransportDataType | undefined) {
  options = options || {};
  super();
  this.queueName = options.queueName;
  this.resourceUri = options.resourceUri;
  this.authenticationProfileUri = options.authenticationProfileUri;
  this.requestedDeliveryGuarantee = (options.requestedDeliveryGuarantee != null) ? options.requestedDeliveryGuarantee : BrokerTransportQualityOfService.Invalid;

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


 toJSON() {
  const out: any = {};
  out.QueueName = this.queueName;
  out.ResourceUri = this.resourceUri;
  out.AuthenticationProfileUri = this.authenticationProfileUri;
  out.RequestedDeliveryGuarantee = this.requestedDeliveryGuarantee;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.queueName = inp.QueueName;
  this.resourceUri = inp.ResourceUri;
  this.authenticationProfileUri = inp.AuthenticationProfileUri;
  this.requestedDeliveryGuarantee = inp.RequestedDeliveryGuarantee;

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



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('BrokerWriterGroupTransportDataType', BrokerWriterGroupTransportDataType, new ExpandedNodeId(2 /*numeric id*/, 15727, 0));
