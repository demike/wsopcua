import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IUnregisterNodesRequest {
    requestHeader?: RequestHeader;
    nodesToUnregister?: ec.NodeId[];
}
/**
Unregisters one or more previously registered nodes.
*/
export declare class UnregisterNodesRequest {
    requestHeader: RequestHeader;
    nodesToUnregister: ec.NodeId[];
    constructor(options?: IUnregisterNodesRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: UnregisterNodesRequest): UnregisterNodesRequest;
}
export declare function decodeUnregisterNodesRequest(inp: DataStream): UnregisterNodesRequest;
