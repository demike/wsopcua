import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IFindServersOnNetworkRequest {
    requestHeader?: RequestHeader;
    startingRecordId?: ec.UInt32;
    maxRecordsToReturn?: ec.UInt32;
    serverCapabilityFilter?: string[];
}
/**

*/
export declare class FindServersOnNetworkRequest {
    requestHeader: RequestHeader;
    startingRecordId: ec.UInt32;
    maxRecordsToReturn: ec.UInt32;
    serverCapabilityFilter: string[];
    constructor(options?: IFindServersOnNetworkRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: FindServersOnNetworkRequest): FindServersOnNetworkRequest;
}
export declare function decodeFindServersOnNetworkRequest(inp: DataStream): FindServersOnNetworkRequest;
