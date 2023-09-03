/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {EnumField} from './EnumField';
import {decodeEnumField} from './EnumField';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {DataTypeDefinition} from './DataTypeDefinition';

export interface IEnumDefinition {
  fields?: EnumField[];
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15989}
*/

export class EnumDefinition extends DataTypeDefinition {
  fields: EnumField[];

 constructor( options?: IEnumDefinition) {
  options = options || {};
  super();
  this.fields = (options.fields != null) ? options.fields : [];

 }


 encode( out: DataStream) {
  ec.encodeArray(this.fields, out);

 }


 decode( inp: DataStream) {
  this.fields = ec.decodeArray(inp, decodeEnumField);

 }


 toJSON() {
  const out: any = {};
  out.Fields = this.fields;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.fields = ec.jsonDecodeStructArray( inp.Fields,EnumField);

 }


 clone( target?: EnumDefinition): EnumDefinition {
  if (!target) {
   target = new EnumDefinition();
  }
  if (this.fields) { target.fields = ec.cloneComplexArray(this.fields); }
  return target;
 }


}
export function decodeEnumDefinition( inp: DataStream): EnumDefinition {
  const obj = new EnumDefinition();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('EnumDefinition', EnumDefinition, new ExpandedNodeId(2 /*numeric id*/, 123, 0));
