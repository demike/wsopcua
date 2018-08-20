import * as ec from '../basic-types';
import { NodeClass } from './NodeClass';
import { DataStream } from '../basic-types/DataStream';
export interface IAddReferencesItem {
    sourceNodeId?: ec.NodeId;
    referenceTypeId?: ec.NodeId;
    isForward?: boolean;
    targetServerUri?: string;
    targetNodeId?: ec.ExpandedNodeId;
    targetNodeClass?: NodeClass;
}
/**
A request to add a reference to the server address space.
*/
export declare class AddReferencesItem {
    sourceNodeId: ec.NodeId;
    referenceTypeId: ec.NodeId;
    isForward: boolean;
    targetServerUri: string;
    targetNodeId: ec.ExpandedNodeId;
    targetNodeClass: NodeClass;
    constructor(options?: IAddReferencesItem);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: AddReferencesItem): AddReferencesItem;
}
export declare function decodeAddReferencesItem(inp: DataStream): AddReferencesItem;
