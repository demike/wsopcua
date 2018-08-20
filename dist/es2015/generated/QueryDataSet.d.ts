import * as ec from '../basic-types';
import { Variant } from '../variant';
import { DataStream } from '../basic-types/DataStream';
export interface IQueryDataSet {
    nodeId?: ec.ExpandedNodeId;
    typeDefinitionNode?: ec.ExpandedNodeId;
    values?: Variant[];
}
/**

*/
export declare class QueryDataSet {
    nodeId: ec.ExpandedNodeId;
    typeDefinitionNode: ec.ExpandedNodeId;
    values: Variant[];
    constructor(options?: IQueryDataSet);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: QueryDataSet): QueryDataSet;
}
export declare function decodeQueryDataSet(inp: DataStream): QueryDataSet;
