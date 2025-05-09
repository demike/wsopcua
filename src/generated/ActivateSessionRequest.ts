/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {RequestHeader} from './RequestHeader';
import {SignatureData} from './SignatureData';
import {SignedSoftwareCertificate} from './SignedSoftwareCertificate';
import {decodeSignedSoftwareCertificate} from './SignedSoftwareCertificate';
import * as ec from '../basic-types';
import {ExtensionObject, encodeExtensionObject, decodeExtensionObject, jsonEncodeExtensionObject, jsonDecodeExtensionObject} from '../basic-types/extension_object';
import {DataStream} from '../basic-types/DataStream';

export type IActivateSessionRequest = Partial<ActivateSessionRequest>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16064}
*/

export class ActivateSessionRequest {
  requestHeader: RequestHeader;
  clientSignature: SignatureData;
  clientSoftwareCertificates: (SignedSoftwareCertificate)[];
  localeIds: (string | undefined)[];
  userIdentityToken: ExtensionObject | undefined;
  userTokenSignature: SignatureData;

 constructor( options?: IActivateSessionRequest | undefined) {
  options = options || {};
  this.requestHeader = (options.requestHeader != null) ? options.requestHeader : new RequestHeader();
  this.clientSignature = (options.clientSignature != null) ? options.clientSignature : new SignatureData();
  this.clientSoftwareCertificates = (options.clientSoftwareCertificates != null) ? options.clientSoftwareCertificates : [];
  this.localeIds = (options.localeIds != null) ? options.localeIds : [];
  this.userIdentityToken = options.userIdentityToken;
  this.userTokenSignature = (options.userTokenSignature != null) ? options.userTokenSignature : new SignatureData();

 }


 encode( out: DataStream) {
  this.requestHeader.encode(out);
  this.clientSignature.encode(out);
  ec.encodeArray(this.clientSoftwareCertificates, out);
  ec.encodeArray(this.localeIds, out, ec.encodeString);
  encodeExtensionObject(this.userIdentityToken, out);
  this.userTokenSignature.encode(out);

 }


 decode( inp: DataStream) {
  this.requestHeader.decode(inp);
  this.clientSignature.decode(inp);
  this.clientSoftwareCertificates = ec.decodeArray(inp, decodeSignedSoftwareCertificate) ?? [];
  this.localeIds = ec.decodeArray(inp, ec.decodeString) ?? [];
  this.userIdentityToken = decodeExtensionObject(inp);
  this.userTokenSignature.decode(inp);

 }


 toJSON() {
  const out: any = {};
  out.RequestHeader = this.requestHeader;
  out.ClientSignature = this.clientSignature;
  out.ClientSoftwareCertificates = this.clientSoftwareCertificates;
  out.LocaleIds = this.localeIds;
  out.UserIdentityToken = jsonEncodeExtensionObject(this.userIdentityToken);
  out.UserTokenSignature = this.userTokenSignature;
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.requestHeader.fromJSON(inp.RequestHeader);
  this.clientSignature.fromJSON(inp.ClientSignature);
  this.clientSoftwareCertificates = ec.jsonDecodeStructArray( inp.ClientSoftwareCertificates,SignedSoftwareCertificate);
  this.localeIds = inp.LocaleIds;
  this.userIdentityToken = jsonDecodeExtensionObject(inp.UserIdentityToken);
  this.userTokenSignature.fromJSON(inp.UserTokenSignature);

 }


 clone( target?: ActivateSessionRequest): ActivateSessionRequest {
  if (!target) {
   target = new ActivateSessionRequest();
  }
  if (this.requestHeader) { target.requestHeader = this.requestHeader.clone(); }
  if (this.clientSignature) { target.clientSignature = this.clientSignature.clone(); }
  if (this.clientSoftwareCertificates) { target.clientSoftwareCertificates = ec.cloneComplexArray(this.clientSoftwareCertificates); }
  target.localeIds = ec.cloneArray(this.localeIds);
  target.userIdentityToken = this.userIdentityToken;
  if (this.userTokenSignature) { target.userTokenSignature = this.userTokenSignature.clone(); }
  return target;
 }


}
export function decodeActivateSessionRequest( inp: DataStream): ActivateSessionRequest {
  const obj = new ActivateSessionRequest();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('ActivateSessionRequest', ActivateSessionRequest, new ExpandedNodeId(2 /*numeric id*/, 467, 0));
