

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ISignatureData {
  algorithm?: string;
  signature?: Uint8Array;
}

/**

*/

export class SignatureData {
  algorithm: string;
  signature: Uint8Array;

 constructor( options?: ISignatureData) {
  options = options || {};
  this.algorithm = (options.algorithm !== undefined) ? options.algorithm : null;
  this.signature = (options.signature !== undefined) ? options.signature : null;

 }


 encode( out: DataStream) {
  ec.encodeString(this.algorithm, out);
  ec.encodeByteString(this.signature, out);

 }


 decode( inp: DataStream) {
  this.algorithm = ec.decodeString(inp);
  this.signature = ec.decodeByteString(inp);

 }


 clone( target?: SignatureData): SignatureData {
  if (!target) {
   target = new SignatureData();
  }
  target.algorithm = this.algorithm;
  target.signature = this.signature;
  return target;
 }


}
export function decodeSignatureData( inp: DataStream): SignatureData {
  const obj = new SignatureData();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('SignatureData', SignatureData, makeExpandedNodeId(458, 0));
