import { ResponseHeader } from './ResponseHeader';
import { BrowseResult } from './BrowseResult';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface IBrowseNextResponse {
    responseHeader?: ResponseHeader;
    results?: BrowseResult[];
    diagnosticInfos?: DiagnosticInfo[];
}
/**
Continues one or more browse operations.
*/
export declare class BrowseNextResponse {
    responseHeader: ResponseHeader;
    results: BrowseResult[];
    diagnosticInfos: DiagnosticInfo[];
    constructor(options?: IBrowseNextResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: BrowseNextResponse): BrowseNextResponse;
}
export declare function decodeBrowseNextResponse(inp: DataStream): BrowseNextResponse;
