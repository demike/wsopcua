/**
 generated by wsopcua data type generator
 do not modify, changes will be overwritten
*/

import {DataStream} from '../basic-types/DataStream';

/**

 * {@link https://reference.opcfoundation.org/nodesets/4/16229}
*/

export enum ServerState {
  Running = 0,
  Failed = 1,
  NoConfiguration = 2,
  Suspended = 3,
  Shutdown = 4,
  Test = 5,
  CommunicationFault = 6,
  Unknown = 7,
}

export function encodeServerState( data: ServerState,  out: DataStream) {
 out.setUint32(data);
 }


export function decodeServerState( inp: DataStream) {
 return inp.getUint32();
 }



import {registerEnumeration} from '../factory/factories_enumerations';
registerEnumeration('ServerState', ServerState, encodeServerState , decodeServerState , undefined);
