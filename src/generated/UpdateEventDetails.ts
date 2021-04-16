/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {PerformUpdateType, encodePerformUpdateType, decodePerformUpdateType} from '.';
import {EventFilter} from '.';
import {HistoryEventFieldList} from '.';
import {decodeHistoryEventFieldList} from '.';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types';
import {HistoryUpdateDetails} from '.';
import {IHistoryUpdateDetails} from '.';

export interface IUpdateEventDetails extends IHistoryUpdateDetails {
  performInsertReplace?: PerformUpdateType;
  filter?: EventFilter;
  eventData?: HistoryEventFieldList[];
}

/**

*/

export class UpdateEventDetails extends HistoryUpdateDetails {
  performInsertReplace: PerformUpdateType;
  filter: EventFilter;
  eventData: HistoryEventFieldList[];

 constructor( options?: IUpdateEventDetails) {
  options = options || {};
  super(options);
  this.performInsertReplace = (options.performInsertReplace != null) ? options.performInsertReplace : null;
  this.filter = (options.filter != null) ? options.filter : new EventFilter();
  this.eventData = (options.eventData != null) ? options.eventData : [];

 }


 encode( out: DataStream) {
  super.encode(out);
  encodePerformUpdateType(this.performInsertReplace, out);
  this.filter.encode(out);
  ec.encodeArray(this.eventData, out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.performInsertReplace = decodePerformUpdateType(inp);
  this.filter.decode(inp);
  this.eventData = ec.decodeArray(inp, decodeHistoryEventFieldList);

 }


 toJSON() {
  const out: any = super.toJSON();
  out.PerformInsertReplace = this.performInsertReplace;
  out.Filter = this.filter;
  out.EventData = this.eventData;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  super.fromJSON(inp);
  this.performInsertReplace = inp.PerformInsertReplace;
  this.filter.fromJSON(inp.Filter);
  this.eventData = ec.jsonDecodeStructArray( inp.EventData,HistoryEventFieldList);

 }


 clone( target?: UpdateEventDetails): UpdateEventDetails {
  if (!target) {
   target = new UpdateEventDetails();
  }
  super.clone(target);
  target.performInsertReplace = this.performInsertReplace;
  if (this.filter) { target.filter = this.filter.clone(); }
  if (this.eventData) { target.eventData = ec.cloneComplexArray(this.eventData); }
  return target;
 }


}
export function decodeUpdateEventDetails( inp: DataStream): UpdateEventDetails {
  const obj = new UpdateEventDetails();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory';
import { ExpandedNodeId } from '../nodeid';
register_class_definition('UpdateEventDetails', UpdateEventDetails, new ExpandedNodeId(2 /*numeric id*/, 685, 0));
