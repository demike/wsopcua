/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ISignatureData {
  algorithm?: string;
  signature?: Uint8Array;
}

/**

*/

export class SignatureData {
  algorithm: string | null;
  signature: Uint8Array | null;

 constructor( options?: ISignatureData) {
  options = options || {};
  this.algorithm = (options.algorithm != null) ? options.algorithm : null;
  this.signature = (options.signature != null) ? options.signature : null;

 }


 encode( out: DataStream) {
  ec.encodeString(this.algorithm, out);
  ec.encodeByteString(this.signature, out);

 }


 decode( inp: DataStream) {
  this.algorithm = ec.decodeString(inp);
  this.signature = ec.decodeByteString(inp);

 }


 toJSON() {
  const out: any = {};
  out.Algorithm = this.algorithm;
  out.Signature = this.signature;
 return out;
 }


 fromJSON( inp: any) {
  this.algorithm = inp.Algorithm;
  this.signature = inp.Signature;

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
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('SignatureData', SignatureData, new ExpandedNodeId(2 /*numeric id*/, 458, 0));
