/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {AggregateConfiguration} from '.';
import {DataStream} from '../basic-types';
import {MonitoringFilterResult} from '.';

export interface IAggregateFilterResult {
  revisedStartTime?: Date;
  revisedProcessingInterval?: ec.Double;
  revisedAggregateConfiguration?: AggregateConfiguration;
}

/**

*/

export class AggregateFilterResult extends MonitoringFilterResult {
  revisedStartTime: Date;
  revisedProcessingInterval: ec.Double;
  revisedAggregateConfiguration: AggregateConfiguration;

 constructor( options?: IAggregateFilterResult) {
  options = options || {};
  super();
  this.revisedStartTime = (options.revisedStartTime != null) ? options.revisedStartTime : new Date();
  this.revisedProcessingInterval = (options.revisedProcessingInterval != null) ? options.revisedProcessingInterval : 0;
  this.revisedAggregateConfiguration = (options.revisedAggregateConfiguration != null) ? options.revisedAggregateConfiguration : new AggregateConfiguration();

 }


 encode( out: DataStream) {
  ec.encodeDateTime(this.revisedStartTime, out);
  ec.encodeDouble(this.revisedProcessingInterval, out);
  this.revisedAggregateConfiguration.encode(out);

 }


 decode( inp: DataStream) {
  this.revisedStartTime = ec.decodeDateTime(inp);
  this.revisedProcessingInterval = ec.decodeDouble(inp);
  this.revisedAggregateConfiguration.decode(inp);

 }


 toJSON() {
  const out: any = {};
  out.RevisedStartTime = ec.jsonEncodeDateTime(this.revisedStartTime);
  out.RevisedProcessingInterval = this.revisedProcessingInterval;
  out.RevisedAggregateConfiguration = this.revisedAggregateConfiguration;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.revisedStartTime = ec.jsonDecodeDateTime(inp.RevisedStartTime);
  this.revisedProcessingInterval = inp.RevisedProcessingInterval;
  this.revisedAggregateConfiguration.fromJSON(inp.RevisedAggregateConfiguration);

 }


 clone( target?: AggregateFilterResult): AggregateFilterResult {
  if (!target) {
   target = new AggregateFilterResult();
  }
  target.revisedStartTime = this.revisedStartTime;
  target.revisedProcessingInterval = this.revisedProcessingInterval;
  if (this.revisedAggregateConfiguration) { target.revisedAggregateConfiguration = this.revisedAggregateConfiguration.clone(); }
  return target;
 }


}
export function decodeAggregateFilterResult( inp: DataStream): AggregateFilterResult {
  const obj = new AggregateFilterResult();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory';
import { ExpandedNodeId } from '../nodeid';
register_class_definition('AggregateFilterResult', AggregateFilterResult, new ExpandedNodeId(2 /*numeric id*/, 739, 0));
