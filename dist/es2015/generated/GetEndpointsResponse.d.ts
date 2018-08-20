import { ResponseHeader } from './ResponseHeader';
import { EndpointDescription } from './EndpointDescription';
import { DataStream } from '../basic-types/DataStream';
export interface IGetEndpointsResponse {
    responseHeader?: ResponseHeader;
    endpoints?: EndpointDescription[];
}
/**
Gets the endpoints used by the server.
*/
export declare class GetEndpointsResponse {
    responseHeader: ResponseHeader;
    endpoints: EndpointDescription[];
    constructor(options?: IGetEndpointsResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: GetEndpointsResponse): GetEndpointsResponse;
}
export declare function decodeGetEndpointsResponse(inp: DataStream): GetEndpointsResponse;
