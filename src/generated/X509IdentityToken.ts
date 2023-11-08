/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';
import {UserIdentityToken} from './UserIdentityToken';
import {IUserIdentityToken} from './UserIdentityToken';

export type IX509IdentityToken = Partial<X509IdentityToken>;

/**

*/

export class X509IdentityToken extends UserIdentityToken {
  certificateData: Uint8Array | null;

 constructor( options?: IX509IdentityToken | null) {
  options = options || {};
  super(options);
  this.certificateData = (options.certificateData != null) ? options.certificateData : null;

 }


 encode( out: DataStream) {
  super.encode(out);
  ec.encodeByteString(this.certificateData, out);

 }


 decode( inp: DataStream) {
  super.decode(inp);
  this.certificateData = ec.decodeByteString(inp);

 }


 toJSON() {
  const out: any = super.toJSON();
  out.CertificateData = ec.jsonEncodeByteString(this.certificateData);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  super.fromJSON(inp);
  this.certificateData = ec.jsonDecodeByteString(inp.CertificateData);

 }


 clone( target?: X509IdentityToken): X509IdentityToken {
  if (!target) {
   target = new X509IdentityToken();
  }
  super.clone(target);
  target.certificateData = this.certificateData;
  return target;
 }


}
export function decodeX509IdentityToken( inp: DataStream): X509IdentityToken {
  const obj = new X509IdentityToken();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('X509IdentityToken', X509IdentityToken, new ExpandedNodeId(2 /*numeric id*/, 327, 0));
