/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {EventFieldList} from './EventFieldList';
import {decodeEventFieldList} from './EventFieldList';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {NotificationData} from './NotificationData';

export type IEventNotificationList = Partial<EventNotificationList>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16213}
*/

export class EventNotificationList extends NotificationData {
  events: EventFieldList[];

 constructor( options?: IEventNotificationList) {
  options = options || {};
  super();
  this.events = (options.events != null) ? options.events : [];

 }


 encode( out: DataStream) {
  ec.encodeArray(this.events, out);

 }


 decode( inp: DataStream) {
  this.events = ec.decodeArray(inp, decodeEventFieldList) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.Events = this.events;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.events = ec.jsonDecodeStructArray( inp.Events,EventFieldList);

 }


 clone( target?: EventNotificationList): EventNotificationList {
  if (!target) {
   target = new EventNotificationList();
  }
  if (this.events) { target.events = ec.cloneComplexArray(this.events); }
  return target;
 }


}
export function decodeEventNotificationList( inp: DataStream): EventNotificationList {
  const obj = new EventNotificationList();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('EventNotificationList', EventNotificationList, new ExpandedNodeId(2 /*numeric id*/, 916, 0));
