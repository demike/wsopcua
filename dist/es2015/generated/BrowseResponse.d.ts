import { ResponseHeader } from './ResponseHeader';
import { BrowseResult } from './BrowseResult';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface IBrowseResponse {
    responseHeader?: ResponseHeader;
    results?: BrowseResult[];
    diagnosticInfos?: DiagnosticInfo[];
}
/**
Browse the references for one or more nodes from the server address space.
*/
export declare class BrowseResponse {
    responseHeader: ResponseHeader;
    results: BrowseResult[];
    diagnosticInfos: DiagnosticInfo[];
    constructor(options?: IBrowseResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: BrowseResponse): BrowseResponse;
}
export declare function decodeBrowseResponse(inp: DataStream): BrowseResponse;
