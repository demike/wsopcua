

import {EnumDefinition} from './EnumDefinition';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {DataTypeDescription} from './DataTypeDescription';
import {IDataTypeDescription} from './DataTypeDescription';

export interface IEnumDescription extends IDataTypeDescription {
  enumDefinition?: EnumDefinition;
  builtInType?: ec.Byte;
}

/**

*/

export class EnumDescription extends DataTypeDescription {
  enumDefinition: EnumDefinition;
  builtInType: ec.Byte;

 constructor( options?: IEnumDescription) {
  options = options || {};
  super(options);
  this.enumDefinition = (options.enumDefinition) ? options.enumDefinition : new EnumDefinition();
  this.builtInType = (options.builtInType) ? options.builtInType : null;

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



