

import {ExtensionObject, encodeExtensionObject, decodeExtensionObject} from '../basic-types/extension_object';
import {DataStream} from '../basic-types/DataStream';
import {ConnectionTransportDataType} from './ConnectionTransportDataType';

export interface IDatagramConnectionTransportDataType {
  discoveryAddress?: ExtensionObject;
}

/**

*/

export class DatagramConnectionTransportDataType extends ConnectionTransportDataType {
  discoveryAddress: ExtensionObject;

 constructor( options?: IDatagramConnectionTransportDataType) {
  options = options || {};
  super();
  this.discoveryAddress = (options.discoveryAddress) ? options.discoveryAddress : null;

 }


 encode( out: DataStream) {
  encodeExtensionObject(this.discoveryAddress, out);

 }


 decode( inp: DataStream) {
  this.discoveryAddress = decodeExtensionObject(inp);

 }


 clone( target?: DatagramConnectionTransportDataType): DatagramConnectionTransportDataType {
  if (!target) {
   target = new DatagramConnectionTransportDataType();
  }
  target.discoveryAddress = this.discoveryAddress;
  return target;
 }


}
export function decodeDatagramConnectionTransportDataType( inp: DataStream): DatagramConnectionTransportDataType {
  const obj = new DatagramConnectionTransportDataType();
   obj.decode(inp);
   return obj;

 }



