/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {SubscribedDataSetDataType} from './SubscribedDataSetDataType';

export type IStandaloneSubscribedDataSetRefDataType = Partial<StandaloneSubscribedDataSetRefDataType>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/2/16812}
*/

export class StandaloneSubscribedDataSetRefDataType extends SubscribedDataSetDataType {
  dataSetName: string | null;

 constructor( options?: IStandaloneSubscribedDataSetRefDataType | null) {
  options = options || {};
  super();
  this.dataSetName = (options.dataSetName != null) ? options.dataSetName : null;

 }


 encode( out: DataStream) {
  ec.encodeString(this.dataSetName, out);

 }


 decode( inp: DataStream) {
  this.dataSetName = ec.decodeString(inp);

 }


 toJSON() {
  const out: any = {};
  out.DataSetName = this.dataSetName;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.dataSetName = inp.DataSetName;

 }


 clone( target?: StandaloneSubscribedDataSetRefDataType): StandaloneSubscribedDataSetRefDataType {
  if (!target) {
   target = new StandaloneSubscribedDataSetRefDataType();
  }
  target.dataSetName = this.dataSetName;
  return target;
 }


}
export function decodeStandaloneSubscribedDataSetRefDataType( inp: DataStream): StandaloneSubscribedDataSetRefDataType {
  const obj = new StandaloneSubscribedDataSetRefDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('StandaloneSubscribedDataSetRefDataType', StandaloneSubscribedDataSetRefDataType, new ExpandedNodeId(2 /*numeric id*/, 23851, 0));
