import { ResponseHeader } from './ResponseHeader';
import { QueryDataSet } from './QueryDataSet';
import { ParsingResult } from './ParsingResult';
import { DiagnosticInfo } from './DiagnosticInfo';
import { ContentFilterResult } from './ContentFilterResult';
import { DataStream } from '../basic-types/DataStream';
export interface IQueryFirstResponse {
    responseHeader?: ResponseHeader;
    queryDataSets?: QueryDataSet[];
    continuationPoint?: Uint8Array;
    parsingResults?: ParsingResult[];
    diagnosticInfos?: DiagnosticInfo[];
    filterResult?: ContentFilterResult;
}
/**

*/
export declare class QueryFirstResponse {
    responseHeader: ResponseHeader;
    queryDataSets: QueryDataSet[];
    continuationPoint: Uint8Array;
    parsingResults: ParsingResult[];
    diagnosticInfos: DiagnosticInfo[];
    filterResult: ContentFilterResult;
    constructor(options?: IQueryFirstResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: QueryFirstResponse): QueryFirstResponse;
}
export declare function decodeQueryFirstResponse(inp: DataStream): QueryFirstResponse;
