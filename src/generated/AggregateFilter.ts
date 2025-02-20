/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {AggregateConfiguration} from './AggregateConfiguration';
import {DataStream} from '../basic-types/DataStream';
import {MonitoringFilter} from './MonitoringFilter';

export type IAggregateFilter = Partial<AggregateFilter>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16184}
*/

export class AggregateFilter extends MonitoringFilter {
  startTime: Date;
  aggregateType: ec.NodeId;
  processingInterval: ec.Double;
  aggregateConfiguration: AggregateConfiguration;

 constructor( options?: IAggregateFilter | undefined) {
  options = options || {};
  super();
  this.startTime = (options.startTime != null) ? options.startTime : new Date();
  this.aggregateType = (options.aggregateType != null) ? options.aggregateType : ec.NodeId.NullNodeId;
  this.processingInterval = (options.processingInterval != null) ? options.processingInterval : 0;
  this.aggregateConfiguration = (options.aggregateConfiguration != null) ? options.aggregateConfiguration : new AggregateConfiguration();

 }


 encode( out: DataStream) {
  ec.encodeDateTime(this.startTime, out);
  ec.encodeNodeId(this.aggregateType, out);
  ec.encodeDouble(this.processingInterval, out);
  this.aggregateConfiguration.encode(out);

 }


 decode( inp: DataStream) {
  this.startTime = ec.decodeDateTime(inp);
  this.aggregateType = ec.decodeNodeId(inp);
  this.processingInterval = ec.decodeDouble(inp);
  this.aggregateConfiguration.decode(inp);

 }


 toJSON() {
  const out: any = {};
  out.StartTime = ec.jsonEncodeDateTime(this.startTime);
  out.AggregateType = ec.jsonEncodeNodeId(this.aggregateType);
  out.ProcessingInterval = this.processingInterval;
  out.AggregateConfiguration = this.aggregateConfiguration;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.startTime = ec.jsonDecodeDateTime(inp.StartTime);
  this.aggregateType = ec.jsonDecodeNodeId(inp.AggregateType);
  this.processingInterval = inp.ProcessingInterval;
  this.aggregateConfiguration.fromJSON(inp.AggregateConfiguration);

 }


 clone( target?: AggregateFilter): AggregateFilter {
  if (!target) {
   target = new AggregateFilter();
  }
  target.startTime = this.startTime;
  target.aggregateType = this.aggregateType;
  target.processingInterval = this.processingInterval;
  if (this.aggregateConfiguration) { target.aggregateConfiguration = this.aggregateConfiguration.clone(); }
  return target;
 }


}
export function decodeAggregateFilter( inp: DataStream): AggregateFilter {
  const obj = new AggregateFilter();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('AggregateFilter', AggregateFilter, new ExpandedNodeId(2 /*numeric id*/, 730, 0));
