import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IRepublishRequest {
    requestHeader?: RequestHeader;
    subscriptionId?: ec.UInt32;
    retransmitSequenceNumber?: ec.UInt32;
}
/**

*/
export declare class RepublishRequest {
    requestHeader: RequestHeader;
    subscriptionId: ec.UInt32;
    retransmitSequenceNumber: ec.UInt32;
    constructor(options?: IRepublishRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: RepublishRequest): RepublishRequest;
}
export declare function decodeRepublishRequest(inp: DataStream): RepublishRequest;
