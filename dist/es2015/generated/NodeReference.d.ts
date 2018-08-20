import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface INodeReference {
    nodeId?: ec.NodeId;
    referenceTypeId?: ec.NodeId;
    isForward?: boolean;
    referencedNodeIds?: ec.NodeId[];
}
/**

*/
export declare class NodeReference {
    nodeId: ec.NodeId;
    referenceTypeId: ec.NodeId;
    isForward: boolean;
    referencedNodeIds: ec.NodeId[];
    constructor(options?: INodeReference);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: NodeReference): NodeReference;
}
export declare function decodeNodeReference(inp: DataStream): NodeReference;
