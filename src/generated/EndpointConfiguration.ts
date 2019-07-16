

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
  this.operationTimeout = (options.operationTimeout !== undefined) ? options.operationTimeout : null;
  this.useBinaryEncoding = (options.useBinaryEncoding !== undefined) ? options.useBinaryEncoding : null;
  this.maxStringLength = (options.maxStringLength !== undefined) ? options.maxStringLength : null;
  this.maxByteStringLength = (options.maxByteStringLength !== undefined) ? options.maxByteStringLength : null;
  this.maxArrayLength = (options.maxArrayLength !== undefined) ? options.maxArrayLength : null;
  this.maxMessageSize = (options.maxMessageSize !== undefined) ? options.maxMessageSize : null;
  this.maxBufferSize = (options.maxBufferSize !== undefined) ? options.maxBufferSize : null;
  this.channelLifetime = (options.channelLifetime !== undefined) ? options.channelLifetime : null;
  this.securityTokenLifetime = (options.securityTokenLifetime !== undefined) ? options.securityTokenLifetime : null;

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('EndpointConfiguration', EndpointConfiguration, makeExpandedNodeId(333, 0));
