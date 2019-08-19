

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface IDecimalDataType {
  scale?: ec.Int16;
  value?: Uint8Array;
}

/**

*/

export class DecimalDataType {
  scale: ec.Int16;
  value: Uint8Array;

 constructor( options?: IDecimalDataType) {
  options = options || {};
  this.scale = (options.scale != null) ? options.scale : null;
  this.value = (options.value != null) ? options.value : null;

 }


 encode( out: DataStream) {
  ec.encodeInt16(this.scale, out);
  ec.encodeByteString(this.value, out);

 }


 decode( inp: DataStream) {
  this.scale = ec.decodeInt16(inp);
  this.value = ec.decodeByteString(inp);

 }


 clone( target?: DecimalDataType): DecimalDataType {
  if (!target) {
   target = new DecimalDataType();
  }
  target.scale = this.scale;
  target.value = this.value;
  return target;
 }


}
export function decodeDecimalDataType( inp: DataStream): DecimalDataType {
  const obj = new DecimalDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('DecimalDataType', DecimalDataType, makeExpandedNodeId(17863, 0));
