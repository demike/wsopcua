

import * as ec from '../basic-types';
import {SimpleAttributeOperand} from './SimpleAttributeOperand';
import {decodeSimpleAttributeOperand} from './SimpleAttributeOperand';
import {ContentFilter} from './ContentFilter';
import {DataStream} from '../basic-types/DataStream';
import {PublishedDataSetSourceDataType} from './PublishedDataSetSourceDataType';

export interface IPublishedEventsDataType {
  eventNotifier?: ec.NodeId;
  selectedFields?: SimpleAttributeOperand[];
  filter?: ContentFilter;
}

/**

*/

export class PublishedEventsDataType extends PublishedDataSetSourceDataType {
  eventNotifier: ec.NodeId;
  selectedFields: SimpleAttributeOperand[];
  filter: ContentFilter;

 constructor( options?: IPublishedEventsDataType) {
  options = options || {};
  super();
  this.eventNotifier = (options.eventNotifier != null) ? options.eventNotifier : null;
  this.selectedFields = (options.selectedFields != null) ? options.selectedFields : [];
  this.filter = (options.filter != null) ? options.filter : new ContentFilter();

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.eventNotifier, out);
  ec.encodeArray(this.selectedFields, out);
  this.filter.encode(out);

 }


 decode( inp: DataStream) {
  this.eventNotifier = ec.decodeNodeId(inp);
  this.selectedFields = ec.decodeArray(inp, decodeSimpleAttributeOperand);
  this.filter.decode(inp);

 }


 clone( target?: PublishedEventsDataType): PublishedEventsDataType {
  if (!target) {
   target = new PublishedEventsDataType();
  }
  target.eventNotifier = this.eventNotifier;
  if (this.selectedFields) { target.selectedFields = ec.cloneComplexArray(this.selectedFields); }
  if (this.filter) { target.filter = this.filter.clone(); }
  return target;
 }


}
export function decodePublishedEventsDataType( inp: DataStream): PublishedEventsDataType {
  const obj = new PublishedEventsDataType();
   obj.decode(inp);
   return obj;

 }



