

import * as ec from '../basic-types';
import {DataSetOrderingType, encodeDataSetOrderingType, decodeDataSetOrderingType} from './DataSetOrderingType';
import {UadpNetworkMessageContentMask, encodeUadpNetworkMessageContentMask, decodeUadpNetworkMessageContentMask} from './UadpNetworkMessageContentMask';
import {DataStream} from '../basic-types/DataStream';
import {WriterGroupMessageDataType} from './WriterGroupMessageDataType';

export interface IUadpWriterGroupMessageDataType {
  groupVersion?: ec.UInt32;
  dataSetOrdering?: DataSetOrderingType;
  networkMessageContentMask?: UadpNetworkMessageContentMask;
  samplingOffset?: ec.Double;
  publishingOffset?: ec.Double[];
}

/**

*/

export class UadpWriterGroupMessageDataType extends WriterGroupMessageDataType {
  groupVersion: ec.UInt32;
  dataSetOrdering: DataSetOrderingType;
  networkMessageContentMask: UadpNetworkMessageContentMask;
  samplingOffset: ec.Double;
  publishingOffset: ec.Double[];

 constructor( options?: IUadpWriterGroupMessageDataType) {
  options = options || {};
  super();
  this.groupVersion = (options.groupVersion !== undefined) ? options.groupVersion : null;
  this.dataSetOrdering = (options.dataSetOrdering !== undefined) ? options.dataSetOrdering : null;
  this.networkMessageContentMask = (options.networkMessageContentMask !== undefined) ? options.networkMessageContentMask : null;
  this.samplingOffset = (options.samplingOffset !== undefined) ? options.samplingOffset : null;
  this.publishingOffset = (options.publishingOffset !== undefined) ? options.publishingOffset : [];

 }


 encode( out: DataStream) {
  ec.encodeUInt32(this.groupVersion, out);
  encodeDataSetOrderingType(this.dataSetOrdering, out);
  encodeUadpNetworkMessageContentMask(this.networkMessageContentMask, out);
  ec.encodeDouble(this.samplingOffset, out);
  ec.encodeArray(this.publishingOffset, out, ec.encodeDouble);

 }


 decode( inp: DataStream) {
  this.groupVersion = ec.decodeUInt32(inp);
  this.dataSetOrdering = decodeDataSetOrderingType(inp);
  this.networkMessageContentMask = decodeUadpNetworkMessageContentMask(inp);
  this.samplingOffset = ec.decodeDouble(inp);
  this.publishingOffset = ec.decodeArray(inp, ec.decodeDouble);

 }


 clone( target?: UadpWriterGroupMessageDataType): UadpWriterGroupMessageDataType {
  if (!target) {
   target = new UadpWriterGroupMessageDataType();
  }
  target.groupVersion = this.groupVersion;
  target.dataSetOrdering = this.dataSetOrdering;
  target.networkMessageContentMask = this.networkMessageContentMask;
  target.samplingOffset = this.samplingOffset;
  target.publishingOffset = ec.cloneArray(this.publishingOffset);
  return target;
 }


}
export function decodeUadpWriterGroupMessageDataType( inp: DataStream): UadpWriterGroupMessageDataType {
  const obj = new UadpWriterGroupMessageDataType();
   obj.decode(inp);
   return obj;

 }



