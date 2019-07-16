

import {DataStream} from '../basic-types/DataStream';

export enum EventNotifierType {
   None = 0,
  SubscribeToEvents = 1,
  HistoryRead = 4,
  HistoryWrite = 8,

}

export function encodeEventNotifierType( data: EventNotifierType,  out: DataStream) {
 out.setByte(data);
 }


export function decodeEventNotifierType( inp: DataStream) {
 return inp.getByte();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('EventNotifierType', EventNotifierType, encodeEventNotifierType , decodeEventNotifierType , null);
