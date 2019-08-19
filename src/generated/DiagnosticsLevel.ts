

import {DataStream} from '../basic-types/DataStream';

export enum DiagnosticsLevel {
   Basic = 0,
  Advanced = 1,
  Info = 2,
  Log = 3,
  Debug = 4,

}

export function encodeDiagnosticsLevel( data: DiagnosticsLevel,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeDiagnosticsLevel( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('DiagnosticsLevel', DiagnosticsLevel, encodeDiagnosticsLevel , decodeDiagnosticsLevel , null);