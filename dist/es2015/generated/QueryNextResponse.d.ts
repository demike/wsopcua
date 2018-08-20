import { ResponseHeader } from './ResponseHeader';
import { QueryDataSet } from './QueryDataSet';
import { DataStream } from '../basic-types/DataStream';
export interface IQueryNextResponse {
    responseHeader?: ResponseHeader;
    queryDataSets?: QueryDataSet[];
    revisedContinuationPoint?: Uint8Array;
}
/**

*/
export declare class QueryNextResponse {
    responseHeader: ResponseHeader;
    queryDataSets: QueryDataSet[];
    revisedContinuationPoint: Uint8Array;
    constructor(options?: IQueryNextResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: QueryNextResponse): QueryNextResponse;
}
export declare function decodeQueryNextResponse(inp: DataStream): QueryNextResponse;
