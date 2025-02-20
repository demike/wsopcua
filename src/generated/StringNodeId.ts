/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IStringNodeId = Partial<StringNodeId>;

/**

*/

export class StringNodeId {
  namespaceIndex: ec.UInt16;
  identifier: string | undefined;

 constructor( options?: IStringNodeId | undefined) {
  options = options || {};
  this.namespaceIndex = (options.namespaceIndex != null) ? options.namespaceIndex : 0;
  this.identifier = options.identifier;

 }


 encode( out: DataStream) {
  ec.encodeUInt16(this.namespaceIndex, out);
  ec.encodeString(this.identifier, out);

 }


 decode( inp: DataStream) {
  this.namespaceIndex = ec.decodeUInt16(inp);
  this.identifier = ec.decodeString(inp);

 }


 toJSON() {
  const out: any = {};
  out.NamespaceIndex = this.namespaceIndex;
  out.Identifier = this.identifier;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.namespaceIndex = inp.NamespaceIndex;
  this.identifier = inp.Identifier;

 }


 clone( target?: StringNodeId): StringNodeId {
  if (!target) {
   target = new StringNodeId();
  }
  target.namespaceIndex = this.namespaceIndex;
  target.identifier = this.identifier;
  return target;
 }


}
export function decodeStringNodeId( inp: DataStream): StringNodeId {
  const obj = new StringNodeId();
   obj.decode(inp);
   return obj;

 }



