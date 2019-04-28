

import {FilterOperator, encodeFilterOperator, decodeFilterOperator} from './FilterOperator';
import {ExtensionObject, encodeExtensionObject, decodeExtensionObject} from '../basic-types/extension_object';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IContentFilterElement {
  filterOperator?: FilterOperator;
  filterOperands?: ExtensionObject[];
}

/**

*/

export class ContentFilterElement {
  filterOperator: FilterOperator;
  filterOperands: ExtensionObject[];

 constructor( options?: IContentFilterElement) {
  options = options || {};
  this.filterOperator = (options.filterOperator) ? options.filterOperator : null;
  this.filterOperands = (options.filterOperands) ? options.filterOperands : [];

 }


 encode( out: DataStream) {
  encodeFilterOperator(this.filterOperator, out);
  ec.encodeArray(this.filterOperands, out, encodeExtensionObject);

 }


 decode( inp: DataStream) {
  this.filterOperator = decodeFilterOperator(inp);
  this.filterOperands = ec.decodeArray(inp, decodeExtensionObject);

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ContentFilterElement', ContentFilterElement, makeExpandedNodeId(585, 0));
