/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {TransmitQosDataType} from './TransmitQosDataType';

export interface ITransmitQosPriorityDataType {
  priorityLabel?: string;
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/2/16830}
*/

export class TransmitQosPriorityDataType extends TransmitQosDataType {
  priorityLabel: string | null;

 constructor( options?: ITransmitQosPriorityDataType) {
  options = options || {};
  super();
  this.priorityLabel = (options.priorityLabel != null) ? options.priorityLabel : null;

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


 clone( target?: TransmitQosPriorityDataType): TransmitQosPriorityDataType {
  if (!target) {
   target = new TransmitQosPriorityDataType();
  }
  target.priorityLabel = this.priorityLabel;
  return target;
 }


}
export function decodeTransmitQosPriorityDataType( inp: DataStream): TransmitQosPriorityDataType {
  const obj = new TransmitQosPriorityDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('TransmitQosPriorityDataType', TransmitQosPriorityDataType, new ExpandedNodeId(2 /*numeric id*/, 23857, 0));
