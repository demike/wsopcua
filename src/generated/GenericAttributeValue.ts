/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {Variant} from '../variant';
import {DataStream} from '../basic-types';

export interface IGenericAttributeValue {
  attributeId?: ec.UInt32;
  value?: Variant;
}

/**

*/

export class GenericAttributeValue {
  attributeId: ec.UInt32;
  value: Variant;

 constructor( options?: IGenericAttributeValue) {
  options = options || {};
  this.attributeId = (options.attributeId != null) ? options.attributeId : 0;
  this.value = (options.value != null) ? options.value : new Variant();

 }


 encode( out: DataStream) {
  ec.encodeUInt32(this.attributeId, out);
  this.value.encode(out);

 }


 decode( inp: DataStream) {
  this.attributeId = ec.decodeUInt32(inp);
  this.value.decode(inp);

 }


 toJSON() {
  const out: any = {};
  out.AttributeId = this.attributeId;
  out.Value = this.value;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.attributeId = inp.AttributeId;
  this.value.fromJSON(inp.Value);

 }


 clone( target?: GenericAttributeValue): GenericAttributeValue {
  if (!target) {
   target = new GenericAttributeValue();
  }
  target.attributeId = this.attributeId;
  if (this.value) { target.value = this.value.clone(); }
  return target;
 }


}
export function decodeGenericAttributeValue( inp: DataStream): GenericAttributeValue {
  const obj = new GenericAttributeValue();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory';
import { ExpandedNodeId } from '../nodeid';
register_class_definition('GenericAttributeValue', GenericAttributeValue, new ExpandedNodeId(2 /*numeric id*/, 17610, 0));
