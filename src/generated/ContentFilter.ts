/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {ContentFilterElement} from './ContentFilterElement';
import {decodeContentFilterElement} from './ContentFilterElement';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IContentFilter = Partial<ContentFilter>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16127}
*/

export class ContentFilter {
  elements: ContentFilterElement[];

 constructor( options?: IContentFilter) {
  options = options || {};
  this.elements = (options.elements != null) ? options.elements : [];

 }


 encode( out: DataStream) {
  ec.encodeArray(this.elements, out);

 }


 decode( inp: DataStream) {
  this.elements = ec.decodeArray(inp, decodeContentFilterElement) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.Elements = this.elements;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.elements = ec.jsonDecodeStructArray( inp.Elements,ContentFilterElement);

 }


 clone( target?: ContentFilter): ContentFilter {
  if (!target) {
   target = new ContentFilter();
  }
  if (this.elements) { target.elements = ec.cloneComplexArray(this.elements); }
  return target;
 }


}
export function decodeContentFilter( inp: DataStream): ContentFilter {
  const obj = new ContentFilter();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ContentFilter', ContentFilter, new ExpandedNodeId(2 /*numeric id*/, 588, 0));
