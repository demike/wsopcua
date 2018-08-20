import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IDeleteNodesItem {
    nodeId?: ec.NodeId;
    deleteTargetReferences?: boolean;
}
/**
A request to delete a node to the server address space.
*/
export declare class DeleteNodesItem {
    nodeId: ec.NodeId;
    deleteTargetReferences: boolean;
    constructor(options?: IDeleteNodesItem);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: DeleteNodesItem): DeleteNodesItem;
}
export declare function decodeDeleteNodesItem(inp: DataStream): DeleteNodesItem;
