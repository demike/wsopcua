

import * as ec from '../basic-types';
import {ServerState, encodeServerState, decodeServerState} from './ServerState';
import {BuildInfo} from './BuildInfo';
import {LocalizedText} from './LocalizedText';
import {DataStream} from '../basic-types/DataStream';

export interface IServerStatusDataType {
  startTime?: Date;
  currentTime?: Date;
  state?: ServerState;
  buildInfo?: BuildInfo;
  secondsTillShutdown?: ec.UInt32;
  shutdownReason?: LocalizedText;
}

/**

*/

export class ServerStatusDataType {
  startTime: Date;
  currentTime: Date;
  state: ServerState;
  buildInfo: BuildInfo;
  secondsTillShutdown: ec.UInt32;
  shutdownReason: LocalizedText;

 constructor( options?: IServerStatusDataType) {
  options = options || {};
  this.startTime = (options.startTime !== undefined) ? options.startTime : null;
  this.currentTime = (options.currentTime !== undefined) ? options.currentTime : null;
  this.state = (options.state !== undefined) ? options.state : null;
  this.buildInfo = (options.buildInfo !== undefined) ? options.buildInfo : new BuildInfo();
  this.secondsTillShutdown = (options.secondsTillShutdown !== undefined) ? options.secondsTillShutdown : null;
  this.shutdownReason = (options.shutdownReason !== undefined) ? options.shutdownReason : new LocalizedText();

 }


 encode( out: DataStream) {
  ec.encodeDateTime(this.startTime, out);
  ec.encodeDateTime(this.currentTime, out);
  encodeServerState(this.state, out);
  this.buildInfo.encode(out);
  ec.encodeUInt32(this.secondsTillShutdown, out);
  this.shutdownReason.encode(out);

 }


 decode( inp: DataStream) {
  this.startTime = ec.decodeDateTime(inp);
  this.currentTime = ec.decodeDateTime(inp);
  this.state = decodeServerState(inp);
  this.buildInfo.decode(inp);
  this.secondsTillShutdown = ec.decodeUInt32(inp);
  this.shutdownReason.decode(inp);

 }


 clone( target?: ServerStatusDataType): ServerStatusDataType {
  if (!target) {
   target = new ServerStatusDataType();
  }
  target.startTime = this.startTime;
  target.currentTime = this.currentTime;
  target.state = this.state;
  if (this.buildInfo) { target.buildInfo = this.buildInfo.clone(); }
  target.secondsTillShutdown = this.secondsTillShutdown;
  if (this.shutdownReason) { target.shutdownReason = this.shutdownReason.clone(); }
  return target;
 }


}
export function decodeServerStatusDataType( inp: DataStream): ServerStatusDataType {
  const obj = new ServerStatusDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ServerStatusDataType', ServerStatusDataType, makeExpandedNodeId(864, 0));
