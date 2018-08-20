import { ResponseHeader } from './ResponseHeader';
import { AddNodesResult } from './AddNodesResult';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface IAddNodesResponse {
    responseHeader?: ResponseHeader;
    results?: AddNodesResult[];
    diagnosticInfos?: DiagnosticInfo[];
}
/**
Adds one or more nodes to the server address space.
*/
export declare class AddNodesResponse {
    responseHeader: ResponseHeader;
    results: AddNodesResult[];
    diagnosticInfos: DiagnosticInfo[];
    constructor(options?: IAddNodesResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: AddNodesResponse): AddNodesResponse;
}
export declare function decodeAddNodesResponse(inp: DataStream): AddNodesResponse;
