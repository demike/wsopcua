/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {GenericAttributeValue} from '.';
import {decodeGenericAttributeValue} from '.';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types';
import {NodeAttributes} from '.';
import {INodeAttributes} from '.';

export interface IGenericAttributes extends INodeAttributes {
  attributeValues?: GenericAttributeValue[];
}

/**

*/

export class GenericAttributes extends NodeAttributes {
  attributeValues: GenericAttributeValue[];

 constructor( options?: IGenericAttributes) {
  options = options || {};
  super(options);
  this.attributeValues = (options.attributeValues != null) ? options.attributeValues : [];

 }


 encode( out: DataStream) {
  super.encode(out);
  ec.encodeArray(this.attributeValues, out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.attributeValues = ec.decodeArray(inp, decodeGenericAttributeValue);

 }


 toJSON() {
  const out: any = super.toJSON();
  out.AttributeValues = this.attributeValues;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  super.fromJSON(inp);
  this.attributeValues = ec.jsonDecodeStructArray( inp.AttributeValues,GenericAttributeValue);

 }


 clone( target?: GenericAttributes): GenericAttributes {
  if (!target) {
   target = new GenericAttributes();
  }
  super.clone(target);
  if (this.attributeValues) { target.attributeValues = ec.cloneComplexArray(this.attributeValues); }
  return target;
 }


}
export function decodeGenericAttributes( inp: DataStream): GenericAttributes {
  const obj = new GenericAttributes();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory';
import { ExpandedNodeId } from '../nodeid';
register_class_definition('GenericAttributes', GenericAttributes, new ExpandedNodeId(2 /*numeric id*/, 17611, 0));
