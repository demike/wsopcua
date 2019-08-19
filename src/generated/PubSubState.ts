

import {DataStream} from '../basic-types/DataStream';

export enum PubSubState {
   Disabled = 0,
  Paused = 1,
  Operational = 2,
  Error = 3,

}

export function encodePubSubState( data: PubSubState,  out: DataStream) {
 out.setUint32(data);
 }


export function decodePubSubState( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('PubSubState', PubSubState, encodePubSubState , decodePubSubState , null);