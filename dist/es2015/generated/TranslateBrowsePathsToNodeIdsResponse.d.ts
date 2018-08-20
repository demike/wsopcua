import { ResponseHeader } from './ResponseHeader';
import { BrowsePathResult } from './BrowsePathResult';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface ITranslateBrowsePathsToNodeIdsResponse {
    responseHeader?: ResponseHeader;
    results?: BrowsePathResult[];
    diagnosticInfos?: DiagnosticInfo[];
}
/**
Translates one or more paths in the server address space.
*/
export declare class TranslateBrowsePathsToNodeIdsResponse {
    responseHeader: ResponseHeader;
    results: BrowsePathResult[];
    diagnosticInfos: DiagnosticInfo[];
    constructor(options?: ITranslateBrowsePathsToNodeIdsResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: TranslateBrowsePathsToNodeIdsResponse): TranslateBrowsePathsToNodeIdsResponse;
}
export declare function decodeTranslateBrowsePathsToNodeIdsResponse(inp: DataStream): TranslateBrowsePathsToNodeIdsResponse;
