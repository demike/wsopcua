import * as ec from '../basic-types';
import { QueryDataDescription } from './QueryDataDescription';
import { DataStream } from '../basic-types/DataStream';
export interface INodeTypeDescription {
    typeDefinitionNode?: ec.ExpandedNodeId;
    includeSubTypes?: boolean;
    dataToReturn?: QueryDataDescription[];
}
/**

*/
export declare class NodeTypeDescription {
    typeDefinitionNode: ec.ExpandedNodeId;
    includeSubTypes: boolean;
    dataToReturn: QueryDataDescription[];
    constructor(options?: INodeTypeDescription);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: NodeTypeDescription): NodeTypeDescription;
}
export declare function decodeNodeTypeDescription(inp: DataStream): NodeTypeDescription;
