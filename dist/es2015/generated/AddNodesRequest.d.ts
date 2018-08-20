import { RequestHeader } from './RequestHeader';
import { AddNodesItem } from './AddNodesItem';
import { DataStream } from '../basic-types/DataStream';
export interface IAddNodesRequest {
    requestHeader?: RequestHeader;
    nodesToAdd?: AddNodesItem[];
}
/**
Adds one or more nodes to the server address space.
*/
export declare class AddNodesRequest {
    requestHeader: RequestHeader;
    nodesToAdd: AddNodesItem[];
    constructor(options?: IAddNodesRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: AddNodesRequest): AddNodesRequest;
}
export declare function decodeAddNodesRequest(inp: DataStream): AddNodesRequest;
