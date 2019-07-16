

import * as ec from '../basic-types';
import {UadpNetworkMessageContentMask, encodeUadpNetworkMessageContentMask, decodeUadpNetworkMessageContentMask} from './UadpNetworkMessageContentMask';
import {UadpDataSetMessageContentMask, encodeUadpDataSetMessageContentMask, decodeUadpDataSetMessageContentMask} from './UadpDataSetMessageContentMask';
import {DataStream} from '../basic-types/DataStream';
import {DataSetReaderMessageDataType} from './DataSetReaderMessageDataType';

export interface IUadpDataSetReaderMessageDataType {
  groupVersion?: ec.UInt32;
  networkMessageNumber?: ec.UInt16;
  dataSetOffset?: ec.UInt16;
  dataSetClassId?: ec.Guid;
  networkMessageContentMask?: UadpNetworkMessageContentMask;
  dataSetMessageContentMask?: UadpDataSetMessageContentMask;
  publishingInterval?: ec.Double;
  receiveOffset?: ec.Double;
  processingOffset?: ec.Double;
}

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

 constructor( options?: IUadpDataSetReaderMessageDataType) {
  options = options || {};
  super();
  this.groupVersion = (options.groupVersion !== undefined) ? options.groupVersion : null;
  this.networkMessageNumber = (options.networkMessageNumber !== undefined) ? options.networkMessageNumber : null;
  this.dataSetOffset = (options.dataSetOffset !== undefined) ? options.dataSetOffset : null;
  this.dataSetClassId = (options.dataSetClassId !== undefined) ? options.dataSetClassId : null;
  this.networkMessageContentMask = (options.networkMessageContentMask !== undefined) ? options.networkMessageContentMask : null;
  this.dataSetMessageContentMask = (options.dataSetMessageContentMask !== undefined) ? options.dataSetMessageContentMask : null;
  this.publishingInterval = (options.publishingInterval !== undefined) ? options.publishingInterval : null;
  this.receiveOffset = (options.receiveOffset !== undefined) ? options.receiveOffset : null;
  this.processingOffset = (options.processingOffset !== undefined) ? options.processingOffset : null;

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



