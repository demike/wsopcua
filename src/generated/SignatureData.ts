/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type ISignatureData = Partial<SignatureData>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16054}
*/

export class SignatureData {
  algorithm: string | undefined;
  signature: Uint8Array | undefined;

 constructor( options?: ISignatureData | undefined) {
  options = options || {};
  this.algorithm = options.algorithm;
  this.signature = options.signature;

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
  out.Signature = ec.jsonEncodeByteString(this.signature);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.algorithm = inp.Algorithm;
  this.signature = ec.jsonDecodeByteString(inp.Signature);

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
