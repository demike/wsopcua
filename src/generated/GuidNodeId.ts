

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IGuidNodeId {
  namespaceIndex?: ec.UInt16;
  identifier?: ec.Guid;
}

/**

*/

export class GuidNodeId {
  namespaceIndex: ec.UInt16;
  identifier: ec.Guid;

 constructor( options?: IGuidNodeId) {
  options = options || {};
  this.namespaceIndex = (options.namespaceIndex != null) ? options.namespaceIndex : null;
  this.identifier = (options.identifier != null) ? options.identifier : null;

 }


 encode( out: DataStream) {
  ec.encodeUInt16(this.namespaceIndex, out);
  ec.encodeGuid(this.identifier, out);

 }


 decode( inp: DataStream) {
  this.namespaceIndex = ec.decodeUInt16(inp);
  this.identifier = ec.decodeGuid(inp);

 }


 clone( target?: GuidNodeId): GuidNodeId {
  if (!target) {
   target = new GuidNodeId();
  }
  target.namespaceIndex = this.namespaceIndex;
  target.identifier = this.identifier;
  return target;
 }


}
export function decodeGuidNodeId( inp: DataStream): GuidNodeId {
  const obj = new GuidNodeId();
   obj.decode(inp);
   return obj;

 }



