import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IReferenceNode {
    referenceTypeId?: ec.NodeId;
    isInverse?: boolean;
    targetId?: ec.ExpandedNodeId;
}
/**
Specifies a reference which belongs to a node.
*/
export declare class ReferenceNode {
    referenceTypeId: ec.NodeId;
    isInverse: boolean;
    targetId: ec.ExpandedNodeId;
    constructor(options?: IReferenceNode);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ReferenceNode): ReferenceNode;
}
export declare function decodeReferenceNode(inp: DataStream): ReferenceNode;
