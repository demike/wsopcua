/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

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
  this.publishedDataSets = (options.publishedDataSets != null) ? options.publishedDataSets : [];
  this.connections = (options.connections != null) ? options.connections : [];
  this.enabled = (options.enabled != null) ? options.enabled : false;

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


 toJSON() {
  const out: any = {};
  out.PublishedDataSets = this.publishedDataSets;
  out.Connections = this.connections;
  out.Enabled = this.enabled;
 return out;
 }


 fromJSON( inp: any) {
  this.publishedDataSets = inp.PublishedDataSets.map(m => { const mem = new PublishedDataSetDataType(); mem.fromJSON(m); return mem;});
  this.connections = inp.Connections.map(m => { const mem = new PubSubConnectionDataType(); mem.fromJSON(m); return mem;});
  this.enabled = inp.Enabled;

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



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('PubSubConfigurationDataType', PubSubConfigurationDataType, new ExpandedNodeId(2 /*numeric id*/, 21154, 0));
