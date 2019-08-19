

import {JsonDataSetMessageContentMask, encodeJsonDataSetMessageContentMask, decodeJsonDataSetMessageContentMask} from './JsonDataSetMessageContentMask';
import {DataStream} from '../basic-types/DataStream';
import {DataSetWriterMessageDataType} from './DataSetWriterMessageDataType';

export interface IJsonDataSetWriterMessageDataType {
  dataSetMessageContentMask?: JsonDataSetMessageContentMask;
}

/**

*/

export class JsonDataSetWriterMessageDataType extends DataSetWriterMessageDataType {
  dataSetMessageContentMask: JsonDataSetMessageContentMask;

 constructor( options?: IJsonDataSetWriterMessageDataType) {
  options = options || {};
  super();
  this.dataSetMessageContentMask = (options.dataSetMessageContentMask != null) ? options.dataSetMessageContentMask : null;

 }


 encode( out: DataStream) {
  encodeJsonDataSetMessageContentMask(this.dataSetMessageContentMask, out);

 }


 decode( inp: DataStream) {
  this.dataSetMessageContentMask = decodeJsonDataSetMessageContentMask(inp);

 }


 clone( target?: JsonDataSetWriterMessageDataType): JsonDataSetWriterMessageDataType {
  if (!target) {
   target = new JsonDataSetWriterMessageDataType();
  }
  target.dataSetMessageContentMask = this.dataSetMessageContentMask;
  return target;
 }


}
export function decodeJsonDataSetWriterMessageDataType( inp: DataStream): JsonDataSetWriterMessageDataType {
  const obj = new JsonDataSetWriterMessageDataType();
   obj.decode(inp);
   return obj;

 }



