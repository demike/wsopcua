

import {Variant} from '../variant';
import {decodeVariant} from '../variant';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IHistoryEventFieldList {
  eventFields?: Variant[];
}

/**

*/

export class HistoryEventFieldList {
  eventFields: Variant[];

 constructor( options?: IHistoryEventFieldList) {
  options = options || {};
  this.eventFields = (options.eventFields != null) ? options.eventFields : [];

 }


 encode( out: DataStream) {
  ec.encodeArray(this.eventFields, out);

 }


 decode( inp: DataStream) {
  this.eventFields = ec.decodeArray(inp, decodeVariant);

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('HistoryEventFieldList', HistoryEventFieldList, makeExpandedNodeId(922, 0));
