

import {JsonNetworkMessageContentMask, encodeJsonNetworkMessageContentMask, decodeJsonNetworkMessageContentMask} from './JsonNetworkMessageContentMask';
import {JsonDataSetMessageContentMask, encodeJsonDataSetMessageContentMask, decodeJsonDataSetMessageContentMask} from './JsonDataSetMessageContentMask';
import {DataStream} from '../basic-types/DataStream';
import {DataSetReaderMessageDataType} from './DataSetReaderMessageDataType';

export interface IJsonDataSetReaderMessageDataType {
  networkMessageContentMask?: JsonNetworkMessageContentMask;
  dataSetMessageContentMask?: JsonDataSetMessageContentMask;
}

/**

*/

export class JsonDataSetReaderMessageDataType extends DataSetReaderMessageDataType {
  networkMessageContentMask: JsonNetworkMessageContentMask;
  dataSetMessageContentMask: JsonDataSetMessageContentMask;

 constructor( options?: IJsonDataSetReaderMessageDataType) {
  options = options || {};
  super();
  this.networkMessageContentMask = (options.networkMessageContentMask !== undefined) ? options.networkMessageContentMask : null;
  this.dataSetMessageContentMask = (options.dataSetMessageContentMask !== undefined) ? options.dataSetMessageContentMask : null;

 }


 encode( out: DataStream) {
  encodeJsonNetworkMessageContentMask(this.networkMessageContentMask, out);
  encodeJsonDataSetMessageContentMask(this.dataSetMessageContentMask, out);

 }


 decode( inp: DataStream) {
  this.networkMessageContentMask = decodeJsonNetworkMessageContentMask(inp);
  this.dataSetMessageContentMask = decodeJsonDataSetMessageContentMask(inp);

 }


 clone( target?: JsonDataSetReaderMessageDataType): JsonDataSetReaderMessageDataType {
  if (!target) {
   target = new JsonDataSetReaderMessageDataType();
  }
  target.networkMessageContentMask = this.networkMessageContentMask;
  target.dataSetMessageContentMask = this.dataSetMessageContentMask;
  return target;
 }


}
export function decodeJsonDataSetReaderMessageDataType( inp: DataStream): JsonDataSetReaderMessageDataType {
  const obj = new JsonDataSetReaderMessageDataType();
   obj.decode(inp);
   return obj;

 }



