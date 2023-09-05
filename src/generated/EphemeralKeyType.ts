/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type IEphemeralKeyType = Partial<EphemeralKeyType>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15500}
*/

export class EphemeralKeyType {
  publicKey: Uint8Array | null;
  signature: Uint8Array | null;

 constructor( options?: IEphemeralKeyType) {
  options = options || {};
  this.publicKey = (options.publicKey != null) ? options.publicKey : null;
  this.signature = (options.signature != null) ? options.signature : null;

 }


 encode( out: DataStream) {
  ec.encodeByteString(this.publicKey, out);
  ec.encodeByteString(this.signature, out);

 }


 decode( inp: DataStream) {
  this.publicKey = ec.decodeByteString(inp);
  this.signature = ec.decodeByteString(inp);

 }


 toJSON() {
  const out: any = {};
  out.PublicKey = ec.jsonEncodeByteString(this.publicKey);
  out.Signature = ec.jsonEncodeByteString(this.signature);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.publicKey = ec.jsonDecodeByteString(inp.PublicKey);
  this.signature = ec.jsonDecodeByteString(inp.Signature);

 }


 clone( target?: EphemeralKeyType): EphemeralKeyType {
  if (!target) {
   target = new EphemeralKeyType();
  }
  target.publicKey = this.publicKey;
  target.signature = this.signature;
  return target;
 }


}
export function decodeEphemeralKeyType( inp: DataStream): EphemeralKeyType {
  const obj = new EphemeralKeyType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('EphemeralKeyType', EphemeralKeyType, new ExpandedNodeId(2 /*numeric id*/, 17549, 0));
