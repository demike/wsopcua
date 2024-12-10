/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {ExtensionObject, encodeExtensionObject, decodeExtensionObject, jsonEncodeExtensionObject, jsonDecodeExtensionObject} from '../basic-types/extension_object';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {DatagramWriterGroupTransportDataType} from './DatagramWriterGroupTransportDataType';
import {IDatagramWriterGroupTransportDataType} from './DatagramWriterGroupTransportDataType';

export type IDatagramWriterGroupTransport2DataType = Partial<DatagramWriterGroupTransport2DataType>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/2/16836}
*/

export class DatagramWriterGroupTransport2DataType extends DatagramWriterGroupTransportDataType {
  address: ExtensionObject | undefined;
  qosCategory: string | undefined;
  datagramQos: (ExtensionObject | undefined)[];
  discoveryAnnounceRate: ec.UInt32;
  topic: string | undefined;

 constructor( options?: IDatagramWriterGroupTransport2DataType | undefined) {
  options = options || {};
  super(options);
  this.address = options.address;
  this.qosCategory = options.qosCategory;
  this.datagramQos = (options.datagramQos != null) ? options.datagramQos : [];
  this.discoveryAnnounceRate = (options.discoveryAnnounceRate != null) ? options.discoveryAnnounceRate : 0;
  this.topic = options.topic;

 }


 encode( out: DataStream) {
  super.encode(out);
  encodeExtensionObject(this.address, out);
  ec.encodeString(this.qosCategory, out);
  ec.encodeArray(this.datagramQos, out, encodeExtensionObject);
  ec.encodeUInt32(this.discoveryAnnounceRate, out);
  ec.encodeString(this.topic, out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.address = decodeExtensionObject(inp);
  this.qosCategory = ec.decodeString(inp);
  this.datagramQos = ec.decodeArray(inp, decodeExtensionObject) ?? [];
  this.discoveryAnnounceRate = ec.decodeUInt32(inp);
  this.topic = ec.decodeString(inp);

 }


 toJSON() {
  const out: any = super.toJSON();
  out.Address = jsonEncodeExtensionObject(this.address);
  out.QosCategory = this.qosCategory;
  out.DatagramQos = ec.jsonEncodeArray(this.datagramQos, jsonEncodeExtensionObject);
  out.DiscoveryAnnounceRate = this.discoveryAnnounceRate;
  out.Topic = this.topic;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  super.fromJSON(inp);
  this.address = jsonDecodeExtensionObject(inp.Address);
  this.qosCategory = inp.QosCategory;
  this.datagramQos = ec.jsonDecodeArray( inp.DatagramQos, jsonDecodeExtensionObject);
  this.discoveryAnnounceRate = inp.DiscoveryAnnounceRate;
  this.topic = inp.Topic;

 }


 clone( target?: DatagramWriterGroupTransport2DataType): DatagramWriterGroupTransport2DataType {
  if (!target) {
   target = new DatagramWriterGroupTransport2DataType();
  }
  super.clone(target);
  target.address = this.address;
  target.qosCategory = this.qosCategory;
  target.datagramQos = ec.cloneArray(this.datagramQos);
  target.discoveryAnnounceRate = this.discoveryAnnounceRate;
  target.topic = this.topic;
  return target;
 }


}
export function decodeDatagramWriterGroupTransport2DataType( inp: DataStream): DatagramWriterGroupTransport2DataType {
  const obj = new DatagramWriterGroupTransport2DataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('DatagramWriterGroupTransport2DataType', DatagramWriterGroupTransport2DataType, new ExpandedNodeId(2 /*numeric id*/, 23865, 0));
