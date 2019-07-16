

import * as ec from '../basic-types';
import {DataValue} from './DataValue';
import {DataStream} from '../basic-types/DataStream';

export interface IWriteValue {
  nodeId?: ec.NodeId;
  attributeId?: ec.UInt32;
  indexRange?: string;
  value?: DataValue;
}

/**

*/

export class WriteValue {
  nodeId: ec.NodeId;
  attributeId: ec.UInt32;
  indexRange: string;
  value: DataValue;

 constructor( options?: IWriteValue) {
  options = options || {};
  this.nodeId = (options.nodeId !== undefined) ? options.nodeId : null;
  this.attributeId = (options.attributeId !== undefined) ? options.attributeId : null;
  this.indexRange = (options.indexRange !== undefined) ? options.indexRange : null;
  this.value = (options.value !== undefined) ? options.value : new DataValue();

 }


 encode( out: DataStream) {
  ec.encodeNodeId(this.nodeId, out);
  ec.encodeUInt32(this.attributeId, out);
  ec.encodeString(this.indexRange, out);
  this.value.encode(out);

 }


 decode( inp: DataStream) {
  this.nodeId = ec.decodeNodeId(inp);
  this.attributeId = ec.decodeUInt32(inp);
  this.indexRange = ec.decodeString(inp);
  this.value.decode(inp);

 }


 clone( target?: WriteValue): WriteValue {
  if (!target) {
   target = new WriteValue();
  }
  target.nodeId = this.nodeId;
  target.attributeId = this.attributeId;
  target.indexRange = this.indexRange;
  if (this.value) { target.value = this.value.clone(); }
  return target;
 }


}
export function decodeWriteValue( inp: DataStream): WriteValue {
  const obj = new WriteValue();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('WriteValue', WriteValue, makeExpandedNodeId(670, 0));
