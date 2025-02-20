/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IOptionSet = Partial<OptionSet>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16005}
*/

export class OptionSet {
  value: Uint8Array | undefined;
  validBits: Uint8Array | undefined;

 constructor( options?: IOptionSet | undefined) {
  options = options || {};
  this.value = options.value;
  this.validBits = options.validBits;

 }


 encode( out: DataStream) {
  ec.encodeByteString(this.value, out);
  ec.encodeByteString(this.validBits, out);

 }


 decode( inp: DataStream) {
  this.value = ec.decodeByteString(inp);
  this.validBits = ec.decodeByteString(inp);

 }


 toJSON() {
  const out: any = {};
  out.Value = ec.jsonEncodeByteString(this.value);
  out.ValidBits = ec.jsonEncodeByteString(this.validBits);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.value = ec.jsonDecodeByteString(inp.Value);
  this.validBits = ec.jsonDecodeByteString(inp.ValidBits);

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
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('OptionSet', OptionSet, new ExpandedNodeId(2 /*numeric id*/, 12765, 0));
