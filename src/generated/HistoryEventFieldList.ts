/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {Variant} from '../variant';
import {decodeVariant} from '../variant';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IHistoryEventFieldList = Partial<HistoryEventFieldList>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16215}
*/

export class HistoryEventFieldList {
  eventFields: (Variant)[];

 constructor( options?: IHistoryEventFieldList | undefined) {
  options = options || {};
  this.eventFields = (options.eventFields != null) ? options.eventFields : [];

 }


 encode( out: DataStream) {
  ec.encodeArray(this.eventFields, out);

 }


 decode( inp: DataStream) {
  this.eventFields = ec.decodeArray(inp, decodeVariant) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.EventFields = this.eventFields;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.eventFields = ec.jsonDecodeStructArray( inp.EventFields,Variant);

 }


 clone( target?: HistoryEventFieldList): HistoryEventFieldList {
  if (!target) {
   target = new HistoryEventFieldList();
  }
  if (this.eventFields) { target.eventFields = ec.cloneComplexArray(this.eventFields); }
  return target;
 }


}
export function decodeHistoryEventFieldList( inp: DataStream): HistoryEventFieldList {
  const obj = new HistoryEventFieldList();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('HistoryEventFieldList', HistoryEventFieldList, new ExpandedNodeId(2 /*numeric id*/, 922, 0));
