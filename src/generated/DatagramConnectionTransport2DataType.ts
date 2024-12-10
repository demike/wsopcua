/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {ExtensionObject, encodeExtensionObject, decodeExtensionObject, jsonEncodeExtensionObject, jsonDecodeExtensionObject} from '../basic-types/extension_object';
import {DataStream} from '../basic-types/DataStream';
import {DatagramConnectionTransportDataType} from './DatagramConnectionTransportDataType';
import {IDatagramConnectionTransportDataType} from './DatagramConnectionTransportDataType';

export type IDatagramConnectionTransport2DataType = Partial<DatagramConnectionTransport2DataType>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/2/16834}
*/

export class DatagramConnectionTransport2DataType extends DatagramConnectionTransportDataType {
  discoveryAnnounceRate: ec.UInt32;
  discoveryMaxMessageSize: ec.UInt32;
  qosCategory: string | undefined;
  datagramQos: (ExtensionObject | undefined)[];

 constructor( options?: IDatagramConnectionTransport2DataType | undefined) {
  options = options || {};
  super(options);
  this.discoveryAnnounceRate = (options.discoveryAnnounceRate != null) ? options.discoveryAnnounceRate : 0;
  this.discoveryMaxMessageSize = (options.discoveryMaxMessageSize != null) ? options.discoveryMaxMessageSize : 0;
  this.qosCategory = options.qosCategory;
  this.datagramQos = (options.datagramQos != null) ? options.datagramQos : [];

 }


 encode( out: DataStream) {
  super.encode(out);
  ec.encodeUInt32(this.discoveryAnnounceRate, out);
  ec.encodeUInt32(this.discoveryMaxMessageSize, out);
  ec.encodeString(this.qosCategory, out);
  ec.encodeArray(this.datagramQos, out, encodeExtensionObject);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.discoveryAnnounceRate = ec.decodeUInt32(inp);
  this.discoveryMaxMessageSize = ec.decodeUInt32(inp);
  this.qosCategory = ec.decodeString(inp);
  this.datagramQos = ec.decodeArray(inp, decodeExtensionObject) ?? [];

 }


 toJSON() {
  const out: any = super.toJSON();
  out.DiscoveryAnnounceRate = this.discoveryAnnounceRate;
  out.DiscoveryMaxMessageSize = this.discoveryMaxMessageSize;
  out.QosCategory = this.qosCategory;
  out.DatagramQos = ec.jsonEncodeArray(this.datagramQos, jsonEncodeExtensionObject);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  super.fromJSON(inp);
  this.discoveryAnnounceRate = inp.DiscoveryAnnounceRate;
  this.discoveryMaxMessageSize = inp.DiscoveryMaxMessageSize;
  this.qosCategory = inp.QosCategory;
  this.datagramQos = ec.jsonDecodeArray( inp.DatagramQos, jsonDecodeExtensionObject);

 }


 clone( target?: DatagramConnectionTransport2DataType): DatagramConnectionTransport2DataType {
  if (!target) {
   target = new DatagramConnectionTransport2DataType();
  }
  super.clone(target);
  target.discoveryAnnounceRate = this.discoveryAnnounceRate;
  target.discoveryMaxMessageSize = this.discoveryMaxMessageSize;
  target.qosCategory = this.qosCategory;
  target.datagramQos = ec.cloneArray(this.datagramQos);
  return target;
 }


}
export function decodeDatagramConnectionTransport2DataType( inp: DataStream): DatagramConnectionTransport2DataType {
  const obj = new DatagramConnectionTransport2DataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('DatagramConnectionTransport2DataType', DatagramConnectionTransport2DataType, new ExpandedNodeId(2 /*numeric id*/, 23864, 0));
