

import {JsonNetworkMessageContentMask, encodeJsonNetworkMessageContentMask, decodeJsonNetworkMessageContentMask} from './JsonNetworkMessageContentMask';
import {DataStream} from '../basic-types/DataStream';
import {WriterGroupMessageDataType} from './WriterGroupMessageDataType';

export interface IJsonWriterGroupMessageDataType {
  networkMessageContentMask?: JsonNetworkMessageContentMask;
}

/**

*/

export class JsonWriterGroupMessageDataType extends WriterGroupMessageDataType {
  networkMessageContentMask: JsonNetworkMessageContentMask;

 constructor( options?: IJsonWriterGroupMessageDataType) {
  options = options || {};
  super();
  this.networkMessageContentMask = (options.networkMessageContentMask !== undefined) ? options.networkMessageContentMask : null;

 }


 encode( out: DataStream) {
  encodeJsonNetworkMessageContentMask(this.networkMessageContentMask, out);

 }


 decode( inp: DataStream) {
  this.networkMessageContentMask = decodeJsonNetworkMessageContentMask(inp);

 }


 clone( target?: JsonWriterGroupMessageDataType): JsonWriterGroupMessageDataType {
  if (!target) {
   target = new JsonWriterGroupMessageDataType();
  }
  target.networkMessageContentMask = this.networkMessageContentMask;
  return target;
 }


}
export function decodeJsonWriterGroupMessageDataType( inp: DataStream): JsonWriterGroupMessageDataType {
  const obj = new JsonWriterGroupMessageDataType();
   obj.decode(inp);
   return obj;

 }



