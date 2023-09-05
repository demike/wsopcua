/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IAggregateConfiguration = Partial<AggregateConfiguration>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16183}
*/

export class AggregateConfiguration {
  useServerCapabilitiesDefaults: boolean;
  treatUncertainAsBad: boolean;
  percentDataBad: ec.Byte;
  percentDataGood: ec.Byte;
  useSlopedExtrapolation: boolean;

 constructor( options?: IAggregateConfiguration) {
  options = options || {};
  this.useServerCapabilitiesDefaults = (options.useServerCapabilitiesDefaults != null) ? options.useServerCapabilitiesDefaults : false;
  this.treatUncertainAsBad = (options.treatUncertainAsBad != null) ? options.treatUncertainAsBad : false;
  this.percentDataBad = (options.percentDataBad != null) ? options.percentDataBad : 0;
  this.percentDataGood = (options.percentDataGood != null) ? options.percentDataGood : 0;
  this.useSlopedExtrapolation = (options.useSlopedExtrapolation != null) ? options.useSlopedExtrapolation : false;

 }


 encode( out: DataStream) {
  ec.encodeBoolean(this.useServerCapabilitiesDefaults, out);
  ec.encodeBoolean(this.treatUncertainAsBad, out);
  ec.encodeByte(this.percentDataBad, out);
  ec.encodeByte(this.percentDataGood, out);
  ec.encodeBoolean(this.useSlopedExtrapolation, out);

 }


 decode( inp: DataStream) {
  this.useServerCapabilitiesDefaults = ec.decodeBoolean(inp);
  this.treatUncertainAsBad = ec.decodeBoolean(inp);
  this.percentDataBad = ec.decodeByte(inp);
  this.percentDataGood = ec.decodeByte(inp);
  this.useSlopedExtrapolation = ec.decodeBoolean(inp);

 }


 toJSON() {
  const out: any = {};
  out.UseServerCapabilitiesDefaults = this.useServerCapabilitiesDefaults;
  out.TreatUncertainAsBad = this.treatUncertainAsBad;
  out.PercentDataBad = this.percentDataBad;
  out.PercentDataGood = this.percentDataGood;
  out.UseSlopedExtrapolation = this.useSlopedExtrapolation;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.useServerCapabilitiesDefaults = inp.UseServerCapabilitiesDefaults;
  this.treatUncertainAsBad = inp.TreatUncertainAsBad;
  this.percentDataBad = inp.PercentDataBad;
  this.percentDataGood = inp.PercentDataGood;
  this.useSlopedExtrapolation = inp.UseSlopedExtrapolation;

 }


 clone( target?: AggregateConfiguration): AggregateConfiguration {
  if (!target) {
   target = new AggregateConfiguration();
  }
  target.useServerCapabilitiesDefaults = this.useServerCapabilitiesDefaults;
  target.treatUncertainAsBad = this.treatUncertainAsBad;
  target.percentDataBad = this.percentDataBad;
  target.percentDataGood = this.percentDataGood;
  target.useSlopedExtrapolation = this.useSlopedExtrapolation;
  return target;
 }


}
export function decodeAggregateConfiguration( inp: DataStream): AggregateConfiguration {
  const obj = new AggregateConfiguration();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('AggregateConfiguration', AggregateConfiguration, new ExpandedNodeId(2 /*numeric id*/, 950, 0));
