import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IRegisterNodesResponse {
    responseHeader?: ResponseHeader;
    registeredNodeIds?: ec.NodeId[];
}
/**
Registers one or more nodes for repeated use within a session.
*/
export declare class RegisterNodesResponse {
    responseHeader: ResponseHeader;
    registeredNodeIds: ec.NodeId[];
    constructor(options?: IRegisterNodesResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: RegisterNodesResponse): RegisterNodesResponse;
}
export declare function decodeRegisterNodesResponse(inp: DataStream): RegisterNodesResponse;
