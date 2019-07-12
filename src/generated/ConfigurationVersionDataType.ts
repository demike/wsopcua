

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IConfigurationVersionDataType {
  majorVersion?: ec.UInt32;
  minorVersion?: ec.UInt32;
}

/**

*/

export class ConfigurationVersionDataType {
  majorVersion: ec.UInt32;
  minorVersion: ec.UInt32;

 constructor( options?: IConfigurationVersionDataType) {
  options = options || {};
  this.majorVersion = (options.majorVersion) ? options.majorVersion : null;
  this.minorVersion = (options.minorVersion) ? options.minorVersion : null;

 }


 encode( out: DataStream) {
  ec.encodeUInt32(this.majorVersion, out);
  ec.encodeUInt32(this.minorVersion, out);

 }


 decode( inp: DataStream) {
  this.majorVersion = ec.decodeUInt32(inp);
  this.minorVersion = ec.decodeUInt32(inp);

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



