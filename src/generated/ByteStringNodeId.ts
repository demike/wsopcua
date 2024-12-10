/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IByteStringNodeId = Partial<ByteStringNodeId>;

/**

*/

export class ByteStringNodeId {
  namespaceIndex: ec.UInt16;
  identifier: Uint8Array | undefined;

 constructor( options?: IByteStringNodeId | undefined) {
  options = options || {};
  this.namespaceIndex = (options.namespaceIndex != null) ? options.namespaceIndex : 0;
  this.identifier = options.identifier;

 }


 encode( out: DataStream) {
  ec.encodeUInt16(this.namespaceIndex, out);
  ec.encodeByteString(this.identifier, out);

 }


 decode( inp: DataStream) {
  this.namespaceIndex = ec.decodeUInt16(inp);
  this.identifier = ec.decodeByteString(inp);

 }


 toJSON() {
  const out: any = {};
  out.NamespaceIndex = this.namespaceIndex;
  out.Identifier = ec.jsonEncodeByteString(this.identifier);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.namespaceIndex = inp.NamespaceIndex;
  this.identifier = ec.jsonDecodeByteString(inp.Identifier);

 }


 clone( target?: ByteStringNodeId): ByteStringNodeId {
  if (!target) {
   target = new ByteStringNodeId();
  }
  target.namespaceIndex = this.namespaceIndex;
  target.identifier = this.identifier;
  return target;
 }


}
export function decodeByteStringNodeId( inp: DataStream): ByteStringNodeId {
  const obj = new ByteStringNodeId();
   obj.decode(inp);
   return obj;

 }



