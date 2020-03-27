/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IEndpointConfiguration {
  operationTimeout?: ec.Int32;
  useBinaryEncoding?: boolean;
  maxStringLength?: ec.Int32;
  maxByteStringLength?: ec.Int32;
  maxArrayLength?: ec.Int32;
  maxMessageSize?: ec.Int32;
  maxBufferSize?: ec.Int32;
  channelLifetime?: ec.Int32;
  securityTokenLifetime?: ec.Int32;
}

/**

*/

export class EndpointConfiguration {
  operationTimeout: ec.Int32;
  useBinaryEncoding: boolean;
  maxStringLength: ec.Int32;
  maxByteStringLength: ec.Int32;
  maxArrayLength: ec.Int32;
  maxMessageSize: ec.Int32;
  maxBufferSize: ec.Int32;
  channelLifetime: ec.Int32;
  securityTokenLifetime: ec.Int32;

 constructor( options?: IEndpointConfiguration) {
  options = options || {};
  this.operationTimeout = (options.operationTimeout != null) ? options.operationTimeout : 0;
  this.useBinaryEncoding = (options.useBinaryEncoding != null) ? options.useBinaryEncoding : false;
  this.maxStringLength = (options.maxStringLength != null) ? options.maxStringLength : 0;
  this.maxByteStringLength = (options.maxByteStringLength != null) ? options.maxByteStringLength : 0;
  this.maxArrayLength = (options.maxArrayLength != null) ? options.maxArrayLength : 0;
  this.maxMessageSize = (options.maxMessageSize != null) ? options.maxMessageSize : 0;
  this.maxBufferSize = (options.maxBufferSize != null) ? options.maxBufferSize : 0;
  this.channelLifetime = (options.channelLifetime != null) ? options.channelLifetime : 0;
  this.securityTokenLifetime = (options.securityTokenLifetime != null) ? options.securityTokenLifetime : 0;

 }


 encode( out: DataStream) {
  ec.encodeInt32(this.operationTimeout, out);
  ec.encodeBoolean(this.useBinaryEncoding, out);
  ec.encodeInt32(this.maxStringLength, out);
  ec.encodeInt32(this.maxByteStringLength, out);
  ec.encodeInt32(this.maxArrayLength, out);
  ec.encodeInt32(this.maxMessageSize, out);
  ec.encodeInt32(this.maxBufferSize, out);
  ec.encodeInt32(this.channelLifetime, out);
  ec.encodeInt32(this.securityTokenLifetime, out);

 }


 decode( inp: DataStream) {
  this.operationTimeout = ec.decodeInt32(inp);
  this.useBinaryEncoding = ec.decodeBoolean(inp);
  this.maxStringLength = ec.decodeInt32(inp);
  this.maxByteStringLength = ec.decodeInt32(inp);
  this.maxArrayLength = ec.decodeInt32(inp);
  this.maxMessageSize = ec.decodeInt32(inp);
  this.maxBufferSize = ec.decodeInt32(inp);
  this.channelLifetime = ec.decodeInt32(inp);
  this.securityTokenLifetime = ec.decodeInt32(inp);

 }


 toJSON() {
  const out: any = {};
  out.OperationTimeout = this.operationTimeout;
  out.UseBinaryEncoding = this.useBinaryEncoding;
  out.MaxStringLength = this.maxStringLength;
  out.MaxByteStringLength = this.maxByteStringLength;
  out.MaxArrayLength = this.maxArrayLength;
  out.MaxMessageSize = this.maxMessageSize;
  out.MaxBufferSize = this.maxBufferSize;
  out.ChannelLifetime = this.channelLifetime;
  out.SecurityTokenLifetime = this.securityTokenLifetime;
 return out;
 }


 fromJSON( inp: any) {
  this.operationTimeout = inp.OperationTimeout;
  this.useBinaryEncoding = inp.UseBinaryEncoding;
  this.maxStringLength = inp.MaxStringLength;
  this.maxByteStringLength = inp.MaxByteStringLength;
  this.maxArrayLength = inp.MaxArrayLength;
  this.maxMessageSize = inp.MaxMessageSize;
  this.maxBufferSize = inp.MaxBufferSize;
  this.channelLifetime = inp.ChannelLifetime;
  this.securityTokenLifetime = inp.SecurityTokenLifetime;

 }


 clone( target?: EndpointConfiguration): EndpointConfiguration {
  if (!target) {
   target = new EndpointConfiguration();
  }
  target.operationTimeout = this.operationTimeout;
  target.useBinaryEncoding = this.useBinaryEncoding;
  target.maxStringLength = this.maxStringLength;
  target.maxByteStringLength = this.maxByteStringLength;
  target.maxArrayLength = this.maxArrayLength;
  target.maxMessageSize = this.maxMessageSize;
  target.maxBufferSize = this.maxBufferSize;
  target.channelLifetime = this.channelLifetime;
  target.securityTokenLifetime = this.securityTokenLifetime;
  return target;
 }


}
export function decodeEndpointConfiguration( inp: DataStream): EndpointConfiguration {
  const obj = new EndpointConfiguration();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('EndpointConfiguration', EndpointConfiguration, new ExpandedNodeId(2 /*numeric id*/, 333, 0));
