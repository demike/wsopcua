

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {EnumValueType} from './EnumValueType';
import {IEnumValueType} from './EnumValueType';

export interface IEnumField extends IEnumValueType {
  name?: string;
}

/**

*/

export class EnumField extends EnumValueType {
  name: string;

 constructor( options?: IEnumField) {
  options = options || {};
  super(options);
  this.name = (options.name !== undefined) ? options.name : null;

 }


 encode( out: DataStream) {
  super.encode(out);
  ec.encodeString(this.name, out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.name = ec.decodeString(inp);

 }


 clone( target?: EnumField): EnumField {
  if (!target) {
   target = new EnumField();
  }
  super.clone(target);
  target.name = this.name;
  return target;
 }


}
export function decodeEnumField( inp: DataStream): EnumField {
  const obj = new EnumField();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('EnumField', EnumField, makeExpandedNodeId(14845, 0));
