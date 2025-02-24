/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {ReceiveQosDataType} from './ReceiveQosDataType';

export type IReceiveQosPriorityDataType = Partial<ReceiveQosPriorityDataType>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/2/16832}
*/

export class ReceiveQosPriorityDataType extends ReceiveQosDataType {
  priorityLabel: string | undefined;

 constructor( options?: IReceiveQosPriorityDataType | undefined) {
  options = options || {};
  super();
  this.priorityLabel = options.priorityLabel;

 }


 encode( out: DataStream) {
  ec.encodeString(this.priorityLabel, out);

 }


 decode( inp: DataStream) {
  this.priorityLabel = ec.decodeString(inp);

 }


 toJSON() {
  const out: any = {};
  out.PriorityLabel = this.priorityLabel;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.priorityLabel = inp.PriorityLabel;

 }


 clone( target?: ReceiveQosPriorityDataType): ReceiveQosPriorityDataType {
  if (!target) {
   target = new ReceiveQosPriorityDataType();
  }
  target.priorityLabel = this.priorityLabel;
  return target;
 }


}
export function decodeReceiveQosPriorityDataType( inp: DataStream): ReceiveQosPriorityDataType {
  const obj = new ReceiveQosPriorityDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ReceiveQosPriorityDataType', ReceiveQosPriorityDataType, new ExpandedNodeId(2 /*numeric id*/, 23861, 0));
