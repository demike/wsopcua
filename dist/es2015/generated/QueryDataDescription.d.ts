import { RelativePath } from './RelativePath';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IQueryDataDescription {
    relativePath?: RelativePath;
    attributeId?: ec.UInt32;
    indexRange?: string;
}
/**

*/
export declare class QueryDataDescription {
    relativePath: RelativePath;
    attributeId: ec.UInt32;
    indexRange: string;
    constructor(options?: IQueryDataDescription);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: QueryDataDescription): QueryDataDescription;
}
export declare function decodeQueryDataDescription(inp: DataStream): QueryDataDescription;
