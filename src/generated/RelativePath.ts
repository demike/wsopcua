/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RelativePathElement} from './RelativePathElement';
import {decodeRelativePathElement} from './RelativePathElement';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IRelativePath {
  elements?: RelativePathElement[];
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16108}
*/

export class RelativePath {
  elements: RelativePathElement[];

 constructor( options?: IRelativePath) {
  options = options || {};
  this.elements = (options.elements != null) ? options.elements : [];

 }


 encode( out: DataStream) {
  ec.encodeArray(this.elements, out);

 }


 decode( inp: DataStream) {
  this.elements = ec.decodeArray(inp, decodeRelativePathElement) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.Elements = this.elements;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.elements = ec.jsonDecodeStructArray( inp.Elements,RelativePathElement);

 }


 clone( target?: RelativePath): RelativePath {
  if (!target) {
   target = new RelativePath();
  }
  if (this.elements) { target.elements = ec.cloneComplexArray(this.elements); }
  return target;
 }


}
export function decodeRelativePath( inp: DataStream): RelativePath {
  const obj = new RelativePath();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('RelativePath', RelativePath, new ExpandedNodeId(2 /*numeric id*/, 542, 0));
