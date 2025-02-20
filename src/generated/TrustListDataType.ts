/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export type ITrustListDataType = Partial<TrustListDataType>;

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/15706}
*/

export class TrustListDataType {
  specifiedLists: ec.UInt32;
  trustedCertificates: (Uint8Array | undefined)[];
  trustedCrls: (Uint8Array | undefined)[];
  issuerCertificates: (Uint8Array | undefined)[];
  issuerCrls: (Uint8Array | undefined)[];

 constructor( options?: ITrustListDataType | undefined) {
  options = options || {};
  this.specifiedLists = (options.specifiedLists != null) ? options.specifiedLists : 0;
  this.trustedCertificates = (options.trustedCertificates != null) ? options.trustedCertificates : [];
  this.trustedCrls = (options.trustedCrls != null) ? options.trustedCrls : [];
  this.issuerCertificates = (options.issuerCertificates != null) ? options.issuerCertificates : [];
  this.issuerCrls = (options.issuerCrls != null) ? options.issuerCrls : [];

 }


 encode( out: DataStream) {
  ec.encodeUInt32(this.specifiedLists, out);
  ec.encodeArray(this.trustedCertificates, out, ec.encodeByteString);
  ec.encodeArray(this.trustedCrls, out, ec.encodeByteString);
  ec.encodeArray(this.issuerCertificates, out, ec.encodeByteString);
  ec.encodeArray(this.issuerCrls, out, ec.encodeByteString);

 }


 decode( inp: DataStream) {
  this.specifiedLists = ec.decodeUInt32(inp);
  this.trustedCertificates = ec.decodeArray(inp, ec.decodeByteString) ?? [];
  this.trustedCrls = ec.decodeArray(inp, ec.decodeByteString) ?? [];
  this.issuerCertificates = ec.decodeArray(inp, ec.decodeByteString) ?? [];
  this.issuerCrls = ec.decodeArray(inp, ec.decodeByteString) ?? [];

 }


 toJSON() {
  const out: any = {};
  out.SpecifiedLists = this.specifiedLists;
  out.TrustedCertificates = ec.jsonEncodeArray(this.trustedCertificates, ec.jsonEncodeByteString);
  out.TrustedCrls = ec.jsonEncodeArray(this.trustedCrls, ec.jsonEncodeByteString);
  out.IssuerCertificates = ec.jsonEncodeArray(this.issuerCertificates, ec.jsonEncodeByteString);
  out.IssuerCrls = ec.jsonEncodeArray(this.issuerCrls, ec.jsonEncodeByteString);
 return out;
 }


 fromJSON( inp: any) {
if (!inp) { return; }
  this.specifiedLists = inp.SpecifiedLists;
  this.trustedCertificates = ec.jsonDecodeArray( inp.TrustedCertificates, ec.jsonDecodeByteString);
  this.trustedCrls = ec.jsonDecodeArray( inp.TrustedCrls, ec.jsonDecodeByteString);
  this.issuerCertificates = ec.jsonDecodeArray( inp.IssuerCertificates, ec.jsonDecodeByteString);
  this.issuerCrls = ec.jsonDecodeArray( inp.IssuerCrls, ec.jsonDecodeByteString);

 }


 clone( target?: TrustListDataType): TrustListDataType {
  if (!target) {
   target = new TrustListDataType();
  }
  target.specifiedLists = this.specifiedLists;
  target.trustedCertificates = ec.cloneArray(this.trustedCertificates);
  target.trustedCrls = ec.cloneArray(this.trustedCrls);
  target.issuerCertificates = ec.cloneArray(this.issuerCertificates);
  target.issuerCrls = ec.cloneArray(this.issuerCrls);
  return target;
 }


}
export function decodeTrustListDataType( inp: DataStream): TrustListDataType {
  const obj = new TrustListDataType();
   obj.decode(inp);
   return obj;

 }



import {register_class_definition} from '../factory/factories_factories';
import { ExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('TrustListDataType', TrustListDataType, new ExpandedNodeId(2 /*numeric id*/, 12680, 0));
