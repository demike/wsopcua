/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {PubSubConfigurationRefMask, encodePubSubConfigurationRefMask, decodePubSubConfigurationRefMask} from './PubSubConfigurationRefMask';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IPubSubConfigurationRefDataType = Partial<PubSubConfigurationRefDataType>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/2/16874}
*/

export class PubSubConfigurationRefDataType {
  configurationMask: PubSubConfigurationRefMask;
  elementIndex: ec.UInt16;
  connectionIndex: ec.UInt16;
  groupIndex: ec.UInt16;

 constructor( options?: IPubSubConfigurationRefDataType | null) {
  options = options || {};
  this.configurationMask = (options.configurationMask != null) ? options.configurationMask : PubSubConfigurationRefMask.None;
  this.elementIndex = (options.elementIndex != null) ? options.elementIndex : 0;
  this.connectionIndex = (options.connectionIndex != null) ? options.connectionIndex : 0;
  this.groupIndex = (options.groupIndex != null) ? options.groupIndex : 0;

 }


 encode( out: DataStream) {
  encodePubSubConfigurationRefMask(this.configurationMask, out);
  ec.encodeUInt16(this.elementIndex, out);
  ec.encodeUInt16(this.connectionIndex, out);
  ec.encodeUInt16(this.groupIndex, out);

 }


 decode( inp: DataStream) {
  this.configurationMask = decodePubSubConfigurationRefMask(inp);
  this.elementIndex = ec.decodeUInt16(inp);
  this.connectionIndex = ec.decodeUInt16(inp);
  this.groupIndex = ec.decodeUInt16(inp);

 }


 toJSON() {
  const out: any = {};
  out.ConfigurationMask = this.configurationMask;
  out.ElementIndex = this.elementIndex;
  out.ConnectionIndex = this.connectionIndex;
  out.GroupIndex = this.groupIndex;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.configurationMask = inp.ConfigurationMask;
  this.elementIndex = inp.ElementIndex;
  this.connectionIndex = inp.ConnectionIndex;
  this.groupIndex = inp.GroupIndex;

 }


 clone( target?: PubSubConfigurationRefDataType): PubSubConfigurationRefDataType {
  if (!target) {
   target = new PubSubConfigurationRefDataType();
  }
  target.configurationMask = this.configurationMask;
  target.elementIndex = this.elementIndex;
  target.connectionIndex = this.connectionIndex;
  target.groupIndex = this.groupIndex;
  return target;
 }


}
export function decodePubSubConfigurationRefDataType( inp: DataStream): PubSubConfigurationRefDataType {
  const obj = new PubSubConfigurationRefDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('PubSubConfigurationRefDataType', PubSubConfigurationRefDataType, new ExpandedNodeId(2 /*numeric id*/, 25531, 0));
