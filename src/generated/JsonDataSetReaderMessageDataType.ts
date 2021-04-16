/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

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
  this.networkMessageContentMask = (options.networkMessageContentMask != null) ? options.networkMessageContentMask : null;
  this.dataSetMessageContentMask = (options.dataSetMessageContentMask != null) ? options.dataSetMessageContentMask : null;

 }


 encode( out: DataStream) {
  encodeJsonNetworkMessageContentMask(this.networkMessageContentMask, out);
  encodeJsonDataSetMessageContentMask(this.dataSetMessageContentMask, out);

 }


 decode( inp: DataStream) {
  this.networkMessageContentMask = decodeJsonNetworkMessageContentMask(inp);
  this.dataSetMessageContentMask = decodeJsonDataSetMessageContentMask(inp);

 }


 toJSON() {
  const out: any = {};
  out.NetworkMessageContentMask = this.networkMessageContentMask;
  out.DataSetMessageContentMask = this.dataSetMessageContentMask;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.networkMessageContentMask = inp.NetworkMessageContentMask;
  this.dataSetMessageContentMask = inp.DataSetMessageContentMask;

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



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('JsonDataSetReaderMessageDataType', JsonDataSetReaderMessageDataType, new ExpandedNodeId(2 /*numeric id*/, 15725, 0));
