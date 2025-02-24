/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {GenericAttributeValue} from './GenericAttributeValue';
import {decodeGenericAttributeValue} from './GenericAttributeValue';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {NodeAttributes} from './NodeAttributes';
import {INodeAttributes} from './NodeAttributes';

export type IGenericAttributes = Partial<GenericAttributes>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16081}
*/

export class GenericAttributes extends NodeAttributes {
  attributeValues: (GenericAttributeValue)[];

 constructor( options?: IGenericAttributes | undefined) {
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
  this.attributeValues = ec.decodeArray(inp, decodeGenericAttributeValue) ?? [];

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



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('GenericAttributes', GenericAttributes, new ExpandedNodeId(2 /*numeric id*/, 17611, 0));
