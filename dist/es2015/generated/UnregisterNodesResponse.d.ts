import { ResponseHeader } from './ResponseHeader';
import { DataStream } from '../basic-types/DataStream';
export interface IUnregisterNodesResponse {
    responseHeader?: ResponseHeader;
}
/**
Unregisters one or more previously registered nodes.
*/
export declare class UnregisterNodesResponse {
    responseHeader: ResponseHeader;
    constructor(options?: IUnregisterNodesResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: UnregisterNodesResponse): UnregisterNodesResponse;
}
export declare function decodeUnregisterNodesResponse(inp: DataStream): UnregisterNodesResponse;
