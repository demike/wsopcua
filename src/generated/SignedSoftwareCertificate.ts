/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ISignedSoftwareCertificate {
  certificateData?: Uint8Array;
  signature?: Uint8Array;
}

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16052}
*/

export class SignedSoftwareCertificate {
  certificateData: Uint8Array | null;
  signature: Uint8Array | null;

 constructor( options?: ISignedSoftwareCertificate) {
  options = options || {};
  this.certificateData = (options.certificateData != null) ? options.certificateData : null;
  this.signature = (options.signature != null) ? options.signature : null;

 }


 encode( out: DataStream) {
  ec.encodeByteString(this.certificateData, out);
  ec.encodeByteString(this.signature, out);

 }


 decode( inp: DataStream) {
  this.certificateData = ec.decodeByteString(inp);
  this.signature = ec.decodeByteString(inp);

 }


 toJSON() {
  const out: any = {};
  out.CertificateData = ec.jsonEncodeByteString(this.certificateData);
  out.Signature = ec.jsonEncodeByteString(this.signature);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.certificateData = ec.jsonDecodeByteString(inp.CertificateData);
  this.signature = ec.jsonDecodeByteString(inp.Signature);

 }


 clone( target?: SignedSoftwareCertificate): SignedSoftwareCertificate {
  if (!target) {
   target = new SignedSoftwareCertificate();
  }
  target.certificateData = this.certificateData;
  target.signature = this.signature;
  return target;
 }


}
export function decodeSignedSoftwareCertificate( inp: DataStream): SignedSoftwareCertificate {
  const obj = new SignedSoftwareCertificate();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('SignedSoftwareCertificate', SignedSoftwareCertificate, new ExpandedNodeId(2 /*numeric id*/, 346, 0));
