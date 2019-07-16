

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IAggregateConfiguration {
  useServerCapabilitiesDefaults?: boolean;
  treatUncertainAsBad?: boolean;
  percentDataBad?: ec.Byte;
  percentDataGood?: ec.Byte;
  useSlopedExtrapolation?: boolean;
}

/**

*/

export class AggregateConfiguration {
  useServerCapabilitiesDefaults: boolean;
  treatUncertainAsBad: boolean;
  percentDataBad: ec.Byte;
  percentDataGood: ec.Byte;
  useSlopedExtrapolation: boolean;

 constructor( options?: IAggregateConfiguration) {
  options = options || {};
  this.useServerCapabilitiesDefaults = (options.useServerCapabilitiesDefaults !== undefined) ? options.useServerCapabilitiesDefaults : null;
  this.treatUncertainAsBad = (options.treatUncertainAsBad !== undefined) ? options.treatUncertainAsBad : null;
  this.percentDataBad = (options.percentDataBad !== undefined) ? options.percentDataBad : null;
  this.percentDataGood = (options.percentDataGood !== undefined) ? options.percentDataGood : null;
  this.useSlopedExtrapolation = (options.useSlopedExtrapolation !== undefined) ? options.useSlopedExtrapolation : null;

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('AggregateConfiguration', AggregateConfiguration, makeExpandedNodeId(950, 0));
