

import {DataStream} from '../basic-types/DataStream';

export enum PubSubDiagnosticsCounterClassification {
   Information = 0,
  Error = 1,

}

export function encodePubSubDiagnosticsCounterClassification( data: PubSubDiagnosticsCounterClassification,  out: DataStream) {
 out.setUint32(data);
 }


export function decodePubSubDiagnosticsCounterClassification( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('PubSubDiagnosticsCounterClassification', PubSubDiagnosticsCounterClassification, encodePubSubDiagnosticsCounterClassification , decodePubSubDiagnosticsCounterClassification , null);
