

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface INumericNodeId {
  namespaceIndex?: ec.UInt16;
  identifier?: ec.UInt32;
}

/**

*/

export class NumericNodeId {
  namespaceIndex: ec.UInt16;
  identifier: ec.UInt32;

 constructor( options?: INumericNodeId) {
  options = options || {};
  this.namespaceIndex = (options.namespaceIndex) ? options.namespaceIndex : null;
  this.identifier = (options.identifier) ? options.identifier : null;

 }


 encode( out: DataStream) {
  ec.encodeUInt16(this.namespaceIndex, out);
  ec.encodeUInt32(this.identifier, out);

 }


 decode( inp: DataStream) {
  this.namespaceIndex = ec.decodeUInt16(inp);
  this.identifier = ec.decodeUInt32(inp);

 }


 clone( target?: NumericNodeId): NumericNodeId {
  if (!target) {
   target = new NumericNodeId();
  }
  target.namespaceIndex = this.namespaceIndex;
  target.identifier = this.identifier;
  return target;
 }


}
export function decodeNumericNodeId( inp: DataStream): NumericNodeId {
  const obj = new NumericNodeId();
   obj.decode(inp);
   return obj;

 }



