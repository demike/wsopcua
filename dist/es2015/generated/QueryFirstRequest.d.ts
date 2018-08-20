import { RequestHeader } from './RequestHeader';
import { ViewDescription } from './ViewDescription';
import { NodeTypeDescription } from './NodeTypeDescription';
import { ContentFilter } from './ContentFilter';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IQueryFirstRequest {
    requestHeader?: RequestHeader;
    view?: ViewDescription;
    nodeTypes?: NodeTypeDescription[];
    filter?: ContentFilter;
    maxDataSetsToReturn?: ec.UInt32;
    maxReferencesToReturn?: ec.UInt32;
}
/**

*/
export declare class QueryFirstRequest {
    requestHeader: RequestHeader;
    view: ViewDescription;
    nodeTypes: NodeTypeDescription[];
    filter: ContentFilter;
    maxDataSetsToReturn: ec.UInt32;
    maxReferencesToReturn: ec.UInt32;
    constructor(options?: IQueryFirstRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: QueryFirstRequest): QueryFirstRequest;
}
export declare function decodeQueryFirstRequest(inp: DataStream): QueryFirstRequest;
