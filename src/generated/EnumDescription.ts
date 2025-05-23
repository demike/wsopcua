/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {EnumDefinition} from './EnumDefinition';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {DataTypeDescription} from './DataTypeDescription';
import {IDataTypeDescription} from './DataTypeDescription';

export type IEnumDescription = Partial<EnumDescription>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15787}
*/

export class EnumDescription extends DataTypeDescription {
  enumDefinition: EnumDefinition;
  builtInType: ec.Byte;

 constructor( options?: IEnumDescription | undefined) {
  options = options || {};
  super(options);
  this.enumDefinition = (options.enumDefinition != null) ? options.enumDefinition : new EnumDefinition();
  this.builtInType = (options.builtInType != null) ? options.builtInType : 0;

 }


 encode( out: DataStream) {
  super.encode(out);
  this.enumDefinition.encode(out);
  ec.encodeByte(this.builtInType, out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.enumDefinition.decode(inp);
  this.builtInType = ec.decodeByte(inp);

 }


 toJSON() {
  const out: any = super.toJSON();
  out.EnumDefinition = this.enumDefinition;
  out.BuiltInType = this.builtInType;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  super.fromJSON(inp);
  this.enumDefinition.fromJSON(inp.EnumDefinition);
  this.builtInType = inp.BuiltInType;

 }


 clone( target?: EnumDescription): EnumDescription {
  if (!target) {
   target = new EnumDescription();
  }
  super.clone(target);
  if (this.enumDefinition) { target.enumDefinition = this.enumDefinition.clone(); }
  target.builtInType = this.builtInType;
  return target;
 }


}
export function decodeEnumDescription( inp: DataStream): EnumDescription {
  const obj = new EnumDescription();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('EnumDescription', EnumDescription, new ExpandedNodeId(2 /*numeric id*/, 127, 0));
