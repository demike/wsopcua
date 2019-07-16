

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IOptionSet {
  value?: Uint8Array;
  validBits?: Uint8Array;
}

/**

*/

export class OptionSet {
  value: Uint8Array;
  validBits: Uint8Array;

 constructor( options?: IOptionSet) {
  options = options || {};
  this.value = (options.value !== undefined) ? options.value : null;
  this.validBits = (options.validBits !== undefined) ? options.validBits : null;

 }


 encode( out: DataStream) {
  ec.encodeByteString(this.value, out);
  ec.encodeByteString(this.validBits, out);

 }


 decode( inp: DataStream) {
  this.value = ec.decodeByteString(inp);
  this.validBits = ec.decodeByteString(inp);

 }


 clone( target?: OptionSet): OptionSet {
  if (!target) {
   target = new OptionSet();
  }
  target.value = this.value;
  target.validBits = this.validBits;
  return target;
 }


}
export function decodeOptionSet( inp: DataStream): OptionSet {
  const obj = new OptionSet();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('OptionSet', OptionSet, makeExpandedNodeId(12765, 0));
