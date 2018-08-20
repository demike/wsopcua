import { RequestHeader } from './RequestHeader';
import { DataStream } from '../basic-types/DataStream';
export interface IFindServersRequest {
    requestHeader?: RequestHeader;
    endpointUrl?: string;
    localeIds?: string[];
    serverUris?: string[];
}
/**
Finds the servers known to the discovery server.
*/
export declare class FindServersRequest {
    requestHeader: RequestHeader;
    endpointUrl: string;
    localeIds: string[];
    serverUris: string[];
    constructor(options?: IFindServersRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: FindServersRequest): FindServersRequest;
}
export declare function decodeFindServersRequest(inp: DataStream): FindServersRequest;
