

import * as ec from '../basic-types';
import {DataStream} from '../basic-types/DataStream';

export interface ITrustListDataType {
  specifiedLists?: ec.UInt32;
  trustedCertificates?: Uint8Array[];
  trustedCrls?: Uint8Array[];
  issuerCertificates?: Uint8Array[];
  issuerCrls?: Uint8Array[];
}

/**

*/

export class TrustListDataType {
  specifiedLists: ec.UInt32;
  trustedCertificates: Uint8Array[];
  trustedCrls: Uint8Array[];
  issuerCertificates: Uint8Array[];
  issuerCrls: Uint8Array[];

 constructor( options?: ITrustListDataType) {
  options = options || {};
  this.specifiedLists = (options.specifiedLists != null) ? options.specifiedLists : null;
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
  this.trustedCertificates = ec.decodeArray(inp, ec.decodeByteString);
  this.trustedCrls = ec.decodeArray(inp, ec.decodeByteString);
  this.issuerCertificates = ec.decodeArray(inp, ec.decodeByteString);
  this.issuerCrls = ec.decodeArray(inp, ec.decodeByteString);

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
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition('TrustListDataType', TrustListDataType, makeExpandedNodeId(12680, 0));
