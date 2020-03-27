/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {HistoryEventFieldList} from './HistoryEventFieldList';
import {decodeHistoryEventFieldList} from './HistoryEventFieldList';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IHistoryEvent {
  events?: HistoryEventFieldList[];
}

/**

*/

export class HistoryEvent {
  events: HistoryEventFieldList[];

 constructor( options?: IHistoryEvent) {
  options = options || {};
  this.events = (options.events != null) ? options.events : [];

 }


 encode( out: DataStream) {
  ec.encodeArray(this.events, out);

 }


 decode( inp: DataStream) {
  this.events = ec.decodeArray(inp, decodeHistoryEventFieldList);

 }


 toJSON() {
  const out: any = {};
  out.Events = this.events;
 return out;
 }


 fromJSON( inp: any) {
  this.events = inp.Events.map(m => { const mem = new HistoryEventFieldList(); mem.fromJSON(m); return mem;});

 }


 clone( target?: HistoryEvent): HistoryEvent {
  if (!target) {
   target = new HistoryEvent();
  }
  if (this.events) { target.events = ec.cloneComplexArray(this.events); }
  return target;
 }


}
export function decodeHistoryEvent( inp: DataStream): HistoryEvent {
  const obj = new HistoryEvent();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('HistoryEvent', HistoryEvent, new ExpandedNodeId(2 /*numeric id*/, 661, 0));
