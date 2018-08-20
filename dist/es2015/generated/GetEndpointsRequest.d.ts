import { RequestHeader } from './RequestHeader';
import { DataStream } from '../basic-types/DataStream';
export interface IGetEndpointsRequest {
    requestHeader?: RequestHeader;
    endpointUrl?: string;
    localeIds?: string[];
    profileUris?: string[];
}
/**
Gets the endpoints used by the server.
*/
export declare class GetEndpointsRequest {
    requestHeader: RequestHeader;
    endpointUrl: string;
    localeIds: string[];
    profileUris: string[];
    constructor(options?: IGetEndpointsRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: GetEndpointsRequest): GetEndpointsRequest;
}
export declare function decodeGetEndpointsRequest(inp: DataStream): GetEndpointsRequest;
