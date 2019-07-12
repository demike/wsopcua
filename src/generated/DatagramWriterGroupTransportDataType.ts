

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {WriterGroupTransportDataType} from './WriterGroupTransportDataType';

export interface IDatagramWriterGroupTransportDataType {
  messageRepeatCount?: ec.Byte;
  messageRepeatDelay?: ec.Double;
}

/**

*/

export class DatagramWriterGroupTransportDataType extends WriterGroupTransportDataType {
  messageRepeatCount: ec.Byte;
  messageRepeatDelay: ec.Double;

 constructor( options?: IDatagramWriterGroupTransportDataType) {
  options = options || {};
  super();
  this.messageRepeatCount = (options.messageRepeatCount) ? options.messageRepeatCount : null;
  this.messageRepeatDelay = (options.messageRepeatDelay) ? options.messageRepeatDelay : null;

 }


 encode( out: DataStream) {
  ec.encodeByte(this.messageRepeatCount, out);
  ec.encodeDouble(this.messageRepeatDelay, out);

 }


 decode( inp: DataStream) {
  this.messageRepeatCount = ec.decodeByte(inp);
  this.messageRepeatDelay = ec.decodeDouble(inp);

 }


 clone( target?: DatagramWriterGroupTransportDataType): DatagramWriterGroupTransportDataType {
  if (!target) {
   target = new DatagramWriterGroupTransportDataType();
  }
  target.messageRepeatCount = this.messageRepeatCount;
  target.messageRepeatDelay = this.messageRepeatDelay;
  return target;
 }


}
export function decodeDatagramWriterGroupTransportDataType( inp: DataStream): DatagramWriterGroupTransportDataType {
  const obj = new DatagramWriterGroupTransportDataType();
   obj.decode(inp);
   return obj;

 }



