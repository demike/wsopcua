/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {KeyValuePair} from './KeyValuePair';
import {decodeKeyValuePair} from './KeyValuePair';
import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IAdditionalParametersType {
  parameters?: KeyValuePair[];
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15499}
*/

export class AdditionalParametersType {
  parameters: KeyValuePair[];

 constructor( options?: IAdditionalParametersType) {
  options = options || {};
  this.parameters = (options.parameters != null) ? options.parameters : [];

 }


 encode( out: DataStream) {
  ec.encodeArray(this.parameters, out);

 }


 decode( inp: DataStream) {
  this.parameters = ec.decodeArray(inp, decodeKeyValuePair) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.Parameters = this.parameters;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.parameters = ec.jsonDecodeStructArray( inp.Parameters,KeyValuePair);

 }


 clone( target?: AdditionalParametersType): AdditionalParametersType {
  if (!target) {
   target = new AdditionalParametersType();
  }
  if (this.parameters) { target.parameters = ec.cloneComplexArray(this.parameters); }
  return target;
 }


}
export function decodeAdditionalParametersType( inp: DataStream): AdditionalParametersType {
  const obj = new AdditionalParametersType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('AdditionalParametersType', AdditionalParametersType, new ExpandedNodeId(2 /*numeric id*/, 17537, 0));
