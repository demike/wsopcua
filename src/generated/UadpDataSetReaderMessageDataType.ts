/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {UadpNetworkMessageContentMask, encodeUadpNetworkMessageContentMask, decodeUadpNetworkMessageContentMask} from './UadpNetworkMessageContentMask';
import {UadpDataSetMessageContentMask, encodeUadpDataSetMessageContentMask, decodeUadpDataSetMessageContentMask} from './UadpDataSetMessageContentMask';
import {DataStream} from '../basic-types/DataStream';
import {DataSetReaderMessageDataType} from './DataSetReaderMessageDataType';

export type IUadpDataSetReaderMessageDataType = Partial<UadpDataSetReaderMessageDataType>;

/**

*/

export class UadpDataSetReaderMessageDataType extends DataSetReaderMessageDataType {
  groupVersion: ec.UInt32;
  networkMessageNumber: ec.UInt16;
  dataSetOffset: ec.UInt16;
  dataSetClassId: ec.Guid;
  networkMessageContentMask: UadpNetworkMessageContentMask;
  dataSetMessageContentMask: UadpDataSetMessageContentMask;
  publishingInterval: ec.Double;
  receiveOffset: ec.Double;
  processingOffset: ec.Double;

 constructor( options?: IUadpDataSetReaderMessageDataType | null) {
  options = options || {};
  super();
  this.groupVersion = (options.groupVersion != null) ? options.groupVersion : 0;
  this.networkMessageNumber = (options.networkMessageNumber != null) ? options.networkMessageNumber : 0;
  this.dataSetOffset = (options.dataSetOffset != null) ? options.dataSetOffset : 0;
  this.dataSetClassId = (options.dataSetClassId != null) ? options.dataSetClassId : "";
  this.networkMessageContentMask = (options.networkMessageContentMask != null) ? options.networkMessageContentMask : UadpNetworkMessageContentMask.None;
  this.dataSetMessageContentMask = (options.dataSetMessageContentMask != null) ? options.dataSetMessageContentMask : UadpDataSetMessageContentMask.None;
  this.publishingInterval = (options.publishingInterval != null) ? options.publishingInterval : 0;
  this.receiveOffset = (options.receiveOffset != null) ? options.receiveOffset : 0;
  this.processingOffset = (options.processingOffset != null) ? options.processingOffset : 0;

 }


 encode( out: DataStream) {
  ec.encodeUInt32(this.groupVersion, out);
  ec.encodeUInt16(this.networkMessageNumber, out);
  ec.encodeUInt16(this.dataSetOffset, out);
  ec.encodeGuid(this.dataSetClassId, out);
  encodeUadpNetworkMessageContentMask(this.networkMessageContentMask, out);
  encodeUadpDataSetMessageContentMask(this.dataSetMessageContentMask, out);
  ec.encodeDouble(this.publishingInterval, out);
  ec.encodeDouble(this.receiveOffset, out);
  ec.encodeDouble(this.processingOffset, out);

 }


 decode( inp: DataStream) {
  this.groupVersion = ec.decodeUInt32(inp);
  this.networkMessageNumber = ec.decodeUInt16(inp);
  this.dataSetOffset = ec.decodeUInt16(inp);
  this.dataSetClassId = ec.decodeGuid(inp);
  this.networkMessageContentMask = decodeUadpNetworkMessageContentMask(inp);
  this.dataSetMessageContentMask = decodeUadpDataSetMessageContentMask(inp);
  this.publishingInterval = ec.decodeDouble(inp);
  this.receiveOffset = ec.decodeDouble(inp);
  this.processingOffset = ec.decodeDouble(inp);

 }


 toJSON() {
  const out: any = {};
  out.GroupVersion = this.groupVersion;
  out.NetworkMessageNumber = this.networkMessageNumber;
  out.DataSetOffset = this.dataSetOffset;
  out.DataSetClassId = this.dataSetClassId;
  out.NetworkMessageContentMask = this.networkMessageContentMask;
  out.DataSetMessageContentMask = this.dataSetMessageContentMask;
  out.PublishingInterval = this.publishingInterval;
  out.ReceiveOffset = this.receiveOffset;
  out.ProcessingOffset = this.processingOffset;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.groupVersion = inp.GroupVersion;
  this.networkMessageNumber = inp.NetworkMessageNumber;
  this.dataSetOffset = inp.DataSetOffset;
  this.dataSetClassId = inp.DataSetClassId;
  this.networkMessageContentMask = inp.NetworkMessageContentMask;
  this.dataSetMessageContentMask = inp.DataSetMessageContentMask;
  this.publishingInterval = inp.PublishingInterval;
  this.receiveOffset = inp.ReceiveOffset;
  this.processingOffset = inp.ProcessingOffset;

 }


 clone( target?: UadpDataSetReaderMessageDataType): UadpDataSetReaderMessageDataType {
  if (!target) {
   target = new UadpDataSetReaderMessageDataType();
  }
  target.groupVersion = this.groupVersion;
  target.networkMessageNumber = this.networkMessageNumber;
  target.dataSetOffset = this.dataSetOffset;
  target.dataSetClassId = this.dataSetClassId;
  target.networkMessageContentMask = this.networkMessageContentMask;
  target.dataSetMessageContentMask = this.dataSetMessageContentMask;
  target.publishingInterval = this.publishingInterval;
  target.receiveOffset = this.receiveOffset;
  target.processingOffset = this.processingOffset;
  return target;
 }


}
export function decodeUadpDataSetReaderMessageDataType( inp: DataStream): UadpDataSetReaderMessageDataType {
  const obj = new UadpDataSetReaderMessageDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('UadpDataSetReaderMessageDataType', UadpDataSetReaderMessageDataType, new ExpandedNodeId(2 /*numeric id*/, 15718, 0));
