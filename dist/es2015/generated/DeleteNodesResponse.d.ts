import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface IDeleteNodesResponse {
    responseHeader?: ResponseHeader;
    results?: ec.StatusCode[];
    diagnosticInfos?: DiagnosticInfo[];
}
/**
Delete one or more nodes from the server address space.
*/
export declare class DeleteNodesResponse {
    responseHeader: ResponseHeader;
    results: ec.StatusCode[];
    diagnosticInfos: DiagnosticInfo[];
    constructor(options?: IDeleteNodesResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: DeleteNodesResponse): DeleteNodesResponse;
}
export declare function decodeDeleteNodesResponse(inp: DataStream): DeleteNodesResponse;
