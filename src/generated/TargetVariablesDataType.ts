

import {FieldTargetDataType} from './FieldTargetDataType';
import {decodeFieldTargetDataType} from './FieldTargetDataType';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {SubscribedDataSetDataType} from './SubscribedDataSetDataType';

export interface ITargetVariablesDataType {
  targetVariables?: FieldTargetDataType[];
}

/**

*/

export class TargetVariablesDataType extends SubscribedDataSetDataType {
  targetVariables: FieldTargetDataType[];

 constructor( options?: ITargetVariablesDataType) {
  options = options || {};
  super();
  this.targetVariables = (options.targetVariables) ? options.targetVariables : [];

 }


 encode( out: DataStream) {
  ec.encodeArray(this.targetVariables, out);

 }


 decode( inp: DataStream) {
  this.targetVariables = ec.decodeArray(inp, decodeFieldTargetDataType);

 }


 clone( target?: TargetVariablesDataType): TargetVariablesDataType {
  if (!target) {
   target = new TargetVariablesDataType();
  }
  if (this.targetVariables) { target.targetVariables = ec.cloneComplexArray(this.targetVariables); }
  return target;
 }


}
export function decodeTargetVariablesDataType( inp: DataStream): TargetVariablesDataType {
  const obj = new TargetVariablesDataType();
   obj.decode(inp);
   return obj;

 }



