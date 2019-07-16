

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IBuildInfo {
  productUri?: string;
  manufacturerName?: string;
  productName?: string;
  softwareVersion?: string;
  buildNumber?: string;
  buildDate?: Date;
}

/**

*/

export class BuildInfo {
  productUri: string;
  manufacturerName: string;
  productName: string;
  softwareVersion: string;
  buildNumber: string;
  buildDate: Date;

 constructor( options?: IBuildInfo) {
  options = options || {};
  this.productUri = (options.productUri !== undefined) ? options.productUri : null;
  this.manufacturerName = (options.manufacturerName !== undefined) ? options.manufacturerName : null;
  this.productName = (options.productName !== undefined) ? options.productName : null;
  this.softwareVersion = (options.softwareVersion !== undefined) ? options.softwareVersion : null;
  this.buildNumber = (options.buildNumber !== undefined) ? options.buildNumber : null;
  this.buildDate = (options.buildDate !== undefined) ? options.buildDate : null;

 }


 encode( out: DataStream) {
  ec.encodeString(this.productUri, out);
  ec.encodeString(this.manufacturerName, out);
  ec.encodeString(this.productName, out);
  ec.encodeString(this.softwareVersion, out);
  ec.encodeString(this.buildNumber, out);
  ec.encodeDateTime(this.buildDate, out);

 }


 decode( inp: DataStream) {
  this.productUri = ec.decodeString(inp);
  this.manufacturerName = ec.decodeString(inp);
  this.productName = ec.decodeString(inp);
  this.softwareVersion = ec.decodeString(inp);
  this.buildNumber = ec.decodeString(inp);
  this.buildDate = ec.decodeDateTime(inp);

 }


 clone( target?: BuildInfo): BuildInfo {
  if (!target) {
   target = new BuildInfo();
  }
  target.productUri = this.productUri;
  target.manufacturerName = this.manufacturerName;
  target.productName = this.productName;
  target.softwareVersion = this.softwareVersion;
  target.buildNumber = this.buildNumber;
  target.buildDate = this.buildDate;
  return target;
 }


}
export function decodeBuildInfo( inp: DataStream): BuildInfo {
  const obj = new BuildInfo();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('BuildInfo', BuildInfo, makeExpandedNodeId(340, 0));
