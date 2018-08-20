import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IAddNodesResult {
    statusCode?: ec.StatusCode;
    addedNodeId?: ec.NodeId;
}
/**
A result of an add node operation.
*/
export declare class AddNodesResult {
    statusCode: ec.StatusCode;
    addedNodeId: ec.NodeId;
    constructor(options?: IAddNodesResult);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: AddNodesResult): AddNodesResult;
}
export declare function decodeAddNodesResult(inp: DataStream): AddNodesResult;
