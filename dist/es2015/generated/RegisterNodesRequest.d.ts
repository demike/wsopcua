import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IRegisterNodesRequest {
    requestHeader?: RequestHeader;
    nodesToRegister?: ec.NodeId[];
}
/**
Registers one or more nodes for repeated use within a session.
*/
export declare class RegisterNodesRequest {
    requestHeader: RequestHeader;
    nodesToRegister: ec.NodeId[];
    constructor(options?: IRegisterNodesRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: RegisterNodesRequest): RegisterNodesRequest;
}
export declare function decodeRegisterNodesRequest(inp: DataStream): RegisterNodesRequest;
