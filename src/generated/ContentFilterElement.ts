/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {FilterOperator, encodeFilterOperator, decodeFilterOperator} from './FilterOperator';
import {ExtensionObject, encodeExtensionObject, decodeExtensionObject, jsonEncodeExtensionObject, jsonDecodeExtensionObject} from '../basic-types/extension_object';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IContentFilterElement = Partial<ContentFilterElement>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16126}
*/

export class ContentFilterElement {
  filterOperator: FilterOperator;
  filterOperands: (ExtensionObject | undefined)[];

 constructor( options?: IContentFilterElement | undefined) {
  options = options || {};
  this.filterOperator = (options.filterOperator != null) ? options.filterOperator : FilterOperator.Invalid;
  this.filterOperands = (options.filterOperands != null) ? options.filterOperands : [];

 }


 encode( out: DataStream) {
  encodeFilterOperator(this.filterOperator, out);
  ec.encodeArray(this.filterOperands, out, encodeExtensionObject);

 }


 decode( inp: DataStream) {
  this.filterOperator = decodeFilterOperator(inp);
  this.filterOperands = ec.decodeArray(inp, decodeExtensionObject) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.FilterOperator = this.filterOperator;
  out.FilterOperands = ec.jsonEncodeArray(this.filterOperands, jsonEncodeExtensionObject);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.filterOperator = inp.FilterOperator;
  this.filterOperands = ec.jsonDecodeArray( inp.FilterOperands, jsonDecodeExtensionObject);

 }


 clone( target?: ContentFilterElement): ContentFilterElement {
  if (!target) {
   target = new ContentFilterElement();
  }
  target.filterOperator = this.filterOperator;
  target.filterOperands = ec.cloneArray(this.filterOperands);
  return target;
 }


}
export function decodeContentFilterElement( inp: DataStream): ContentFilterElement {
  const obj = new ContentFilterElement();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ContentFilterElement', ContentFilterElement, new ExpandedNodeId(2 /*numeric id*/, 585, 0));
