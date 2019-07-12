

import {DataStream} from '../basic-types/DataStream';

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



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('BrokerTransportQualityOfService', BrokerTransportQualityOfService, encodeBrokerTransportQualityOfService , decodeBrokerTransportQualityOfService , null);
