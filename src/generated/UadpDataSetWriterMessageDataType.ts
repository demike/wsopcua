

import {UadpDataSetMessageContentMask, encodeUadpDataSetMessageContentMask, decodeUadpDataSetMessageContentMask} from './UadpDataSetMessageContentMask';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {DataSetWriterMessageDataType} from './DataSetWriterMessageDataType';

export interface IUadpDataSetWriterMessageDataType {
  dataSetMessageContentMask?: UadpDataSetMessageContentMask;
  configuredSize?: ec.UInt16;
  networkMessageNumber?: ec.UInt16;
  dataSetOffset?: ec.UInt16;
}

/**

*/

export class UadpDataSetWriterMessageDataType extends DataSetWriterMessageDataType {
  dataSetMessageContentMask: UadpDataSetMessageContentMask;
  configuredSize: ec.UInt16;
  networkMessageNumber: ec.UInt16;
  dataSetOffset: ec.UInt16;

 constructor( options?: IUadpDataSetWriterMessageDataType) {
  options = options || {};
  super();
  this.dataSetMessageContentMask = (options.dataSetMessageContentMask != null) ? options.dataSetMessageContentMask : null;
  this.configuredSize = (options.configuredSize != null) ? options.configuredSize : null;
  this.networkMessageNumber = (options.networkMessageNumber != null) ? options.networkMessageNumber : null;
  this.dataSetOffset = (options.dataSetOffset != null) ? options.dataSetOffset : null;

 }


 encode( out: DataStream) {
  encodeUadpDataSetMessageContentMask(this.dataSetMessageContentMask, out);
  ec.encodeUInt16(this.configuredSize, out);
  ec.encodeUInt16(this.networkMessageNumber, out);
  ec.encodeUInt16(this.dataSetOffset, out);

 }


 decode( inp: DataStream) {
  this.dataSetMessageContentMask = decodeUadpDataSetMessageContentMask(inp);
  this.configuredSize = ec.decodeUInt16(inp);
  this.networkMessageNumber = ec.decodeUInt16(inp);
  this.dataSetOffset = ec.decodeUInt16(inp);

 }


 clone( target?: UadpDataSetWriterMessageDataType): UadpDataSetWriterMessageDataType {
  if (!target) {
   target = new UadpDataSetWriterMessageDataType();
  }
  target.dataSetMessageContentMask = this.dataSetMessageContentMask;
  target.configuredSize = this.configuredSize;
  target.networkMessageNumber = this.networkMessageNumber;
  target.dataSetOffset = this.dataSetOffset;
  return target;
 }


}
export function decodeUadpDataSetWriterMessageDataType( inp: DataStream): UadpDataSetWriterMessageDataType {
  const obj = new UadpDataSetWriterMessageDataType();
   obj.decode(inp);
   return obj;

 }



