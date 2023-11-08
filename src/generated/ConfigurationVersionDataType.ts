/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IConfigurationVersionDataType = Partial<ConfigurationVersionDataType>;

/**

*/

export class ConfigurationVersionDataType {
  majorVersion: ec.UInt32;
  minorVersion: ec.UInt32;

 constructor( options?: IConfigurationVersionDataType | null) {
  options = options || {};
  this.majorVersion = (options.majorVersion != null) ? options.majorVersion : 0;
  this.minorVersion = (options.minorVersion != null) ? options.minorVersion : 0;

 }


 encode( out: DataStream) {
  ec.encodeUInt32(this.majorVersion, out);
  ec.encodeUInt32(this.minorVersion, out);

 }


 decode( inp: DataStream) {
  this.majorVersion = ec.decodeUInt32(inp);
  this.minorVersion = ec.decodeUInt32(inp);

 }


 toJSON() {
  const out: any = {};
  out.MajorVersion = this.majorVersion;
  out.MinorVersion = this.minorVersion;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.majorVersion = inp.MajorVersion;
  this.minorVersion = inp.MinorVersion;

 }


 clone( target?: ConfigurationVersionDataType): ConfigurationVersionDataType {
  if (!target) {
   target = new ConfigurationVersionDataType();
  }
  target.majorVersion = this.majorVersion;
  target.minorVersion = this.minorVersion;
  return target;
 }


}
export function decodeConfigurationVersionDataType( inp: DataStream): ConfigurationVersionDataType {
  const obj = new ConfigurationVersionDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ConfigurationVersionDataType', ConfigurationVersionDataType, new ExpandedNodeId(2 /*numeric id*/, 14847, 0));
