import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IDeleteReferencesItem {
    sourceNodeId?: ec.NodeId;
    referenceTypeId?: ec.NodeId;
    isForward?: boolean;
    targetNodeId?: ec.ExpandedNodeId;
    deleteBidirectional?: boolean;
}
/**
A request to delete a node from the server address space.
*/
export declare class DeleteReferencesItem {
    sourceNodeId: ec.NodeId;
    referenceTypeId: ec.NodeId;
    isForward: boolean;
    targetNodeId: ec.ExpandedNodeId;
    deleteBidirectional: boolean;
    constructor(options?: IDeleteReferencesItem);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: DeleteReferencesItem): DeleteReferencesItem;
}
export declare function decodeDeleteReferencesItem(inp: DataStream): DeleteReferencesItem;
