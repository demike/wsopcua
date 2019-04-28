

import {DataStream} from '../basic-types/DataStream';

export enum TrustListMasks {
   None = 0,
  TrustedCertificates = 1,
  TrustedCrls = 2,
  IssuerCertificates = 4,
  IssuerCrls = 8,
  All = 15,

}

export function encodeTrustListMasks( data: TrustListMasks,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeTrustListMasks( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('TrustListMasks', TrustListMasks, encodeTrustListMasks , decodeTrustListMasks , null);
