

import {PublishedDataSetDataType} from './PublishedDataSetDataType';
import {decodePublishedDataSetDataType} from './PublishedDataSetDataType';
import {PubSubConnectionDataType} from './PubSubConnectionDataType';
import {decodePubSubConnectionDataType} from './PubSubConnectionDataType';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IPubSubConfigurationDataType {
  publishedDataSets?: PublishedDataSetDataType[];
  connections?: PubSubConnectionDataType[];
  enabled?: boolean;
}

/**

*/

export class PubSubConfigurationDataType {
  publishedDataSets: PublishedDataSetDataType[];
  connections: PubSubConnectionDataType[];
  enabled: boolean;

 constructor( options?: IPubSubConfigurationDataType) {
  options = options || {};
  this.publishedDataSets = (options.publishedDataSets) ? options.publishedDataSets : [];
  this.connections = (options.connections) ? options.connections : [];
  this.enabled = (options.enabled) ? options.enabled : null;

 }


 encode( out: DataStream) {
  ec.encodeArray(this.publishedDataSets, out);
  ec.encodeArray(this.connections, out);
  ec.encodeBoolean(this.enabled, out);

 }


 decode( inp: DataStream) {
  this.publishedDataSets = ec.decodeArray(inp, decodePublishedDataSetDataType);
  this.connections = ec.decodeArray(inp, decodePubSubConnectionDataType);
  this.enabled = ec.decodeBoolean(inp);

 }


 clone( target?: PubSubConfigurationDataType): PubSubConfigurationDataType {
  if (!target) {
   target = new PubSubConfigurationDataType();
  }
  if (this.publishedDataSets) { target.publishedDataSets = ec.cloneComplexArray(this.publishedDataSets); }
  if (this.connections) { target.connections = ec.cloneComplexArray(this.connections); }
  target.enabled = this.enabled;
  return target;
 }


}
export function decodePubSubConfigurationDataType( inp: DataStream): PubSubConfigurationDataType {
  const obj = new PubSubConfigurationDataType();
   obj.decode(inp);
   return obj;

 }



