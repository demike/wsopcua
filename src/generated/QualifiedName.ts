/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IQualifiedName = Partial<QualifiedName>;

/**
A string qualified with a namespace index.
*/

export class QualifiedName {
  namespaceIndex: ec.UInt16;
  name: string | null;

 constructor( options?: IQualifiedName | null) {
  options = options || {};
  this.namespaceIndex = (options.namespaceIndex != null) ? options.namespaceIndex : 0;
  this.name = (options.name != null) ? options.name : null;

 }


 encode( out: DataStream) {
  ec.encodeUInt16(this.namespaceIndex, out);
  ec.encodeString(this.name, out);

 }


 decode( inp: DataStream) {
  this.namespaceIndex = ec.decodeUInt16(inp);
  this.name = ec.decodeString(inp);

 }


 toJSON() {
  const out: any = {};
  out.NamespaceIndex = this.namespaceIndex;
  out.Name = this.name;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.namespaceIndex = inp.NamespaceIndex;
  this.name = inp.Name;

 }


 clone( target?: QualifiedName): QualifiedName {
  if (!target) {
   target = new QualifiedName();
  }
  target.namespaceIndex = this.namespaceIndex;
  target.name = this.name;
  return target;
 }


}
export function decodeQualifiedName( inp: DataStream): QualifiedName {
  const obj = new QualifiedName();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('QualifiedName', QualifiedName, new ExpandedNodeId(2 /*numeric id*/, 20, 0));
