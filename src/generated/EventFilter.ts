/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {SimpleAttributeOperand} from './SimpleAttributeOperand';
import {decodeSimpleAttributeOperand} from './SimpleAttributeOperand';
import {ContentFilter} from './ContentFilter';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {MonitoringFilter} from './MonitoringFilter';

export interface IEventFilter {
  selectClauses?: SimpleAttributeOperand[];
  whereClause?: ContentFilter;
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16182}
*/

export class EventFilter extends MonitoringFilter {
  selectClauses: SimpleAttributeOperand[];
  whereClause: ContentFilter;

 constructor( options?: IEventFilter) {
  options = options || {};
  super();
  this.selectClauses = (options.selectClauses != null) ? options.selectClauses : [];
  this.whereClause = (options.whereClause != null) ? options.whereClause : new ContentFilter();

 }


 encode( out: DataStream) {
  ec.encodeArray(this.selectClauses, out);
  this.whereClause.encode(out);

 }


 decode( inp: DataStream) {
  this.selectClauses = ec.decodeArray(inp, decodeSimpleAttributeOperand);
  this.whereClause.decode(inp);

 }


 toJSON() {
  const out: any = {};
  out.SelectClauses = this.selectClauses;
  out.WhereClause = this.whereClause;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.selectClauses = ec.jsonDecodeStructArray( inp.SelectClauses,SimpleAttributeOperand);
  this.whereClause.fromJSON(inp.WhereClause);

 }


 clone( target?: EventFilter): EventFilter {
  if (!target) {
   target = new EventFilter();
  }
  if (this.selectClauses) { target.selectClauses = ec.cloneComplexArray(this.selectClauses); }
  if (this.whereClause) { target.whereClause = this.whereClause.clone(); }
  return target;
 }


}
export function decodeEventFilter( inp: DataStream): EventFilter {
  const obj = new EventFilter();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('EventFilter', EventFilter, new ExpandedNodeId(2 /*numeric id*/, 725, 0));
