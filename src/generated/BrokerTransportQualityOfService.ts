/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {DataStream} from '../basic-types';

export enum BrokerTransportQualityOfService {
  NotSpecified = 0,
  BestEffort = 1,
  AtLeastOnce = 2,
  AtMostOnce = 3,
  ExactlyOnce = 4,
}

export function encodeBrokerTransportQualityOfService( data: BrokerTransportQualityOfService,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeBrokerTransportQualityOfService( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory';
registerEnumeration('BrokerTransportQualityOfService', BrokerTransportQualityOfService, encodeBrokerTransportQualityOfService , decodeBrokerTransportQualityOfService , undefined);
