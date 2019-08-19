

import {PerformUpdateType, encodePerformUpdateType, decodePerformUpdateType} from './PerformUpdateType';
import {EventFilter} from './EventFilter';
import {HistoryEventFieldList} from './HistoryEventFieldList';
import {decodeHistoryEventFieldList} from './HistoryEventFieldList';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {HistoryUpdateDetails} from './HistoryUpdateDetails';
import {IHistoryUpdateDetails} from './HistoryUpdateDetails';

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



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('UpdateEventDetails', UpdateEventDetails, makeExpandedNodeId(685, 0));
