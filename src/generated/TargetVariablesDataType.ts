/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {FieldTargetDataType} from './FieldTargetDataType';
import {decodeFieldTargetDataType} from './FieldTargetDataType';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {SubscribedDataSetDataType} from './SubscribedDataSetDataType';

export interface ITargetVariablesDataType {
  targetVariables?: FieldTargetDataType[];
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15819}
*/

export class TargetVariablesDataType extends SubscribedDataSetDataType {
  targetVariables: FieldTargetDataType[];

 constructor( options?: ITargetVariablesDataType) {
  options = options || {};
  super();
  this.targetVariables = (options.targetVariables != null) ? options.targetVariables : [];

 }


 encode( out: DataStream) {
  ec.encodeArray(this.targetVariables, out);

 }


 decode( inp: DataStream) {
  this.targetVariables = ec.decodeArray(inp, decodeFieldTargetDataType);

 }


 toJSON() {
  const out: any = {};
  out.TargetVariables = this.targetVariables;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.targetVariables = ec.jsonDecodeStructArray( inp.TargetVariables,FieldTargetDataType);

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



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('TargetVariablesDataType', TargetVariablesDataType, new ExpandedNodeId(2 /*numeric id*/, 15631, 0));
