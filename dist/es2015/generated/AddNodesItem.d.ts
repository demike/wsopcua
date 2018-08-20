import * as ec from '../basic-types';
import { QualifiedName } from './QualifiedName';
import { NodeClass } from './NodeClass';
import { DataStream } from '../basic-types/DataStream';
export interface IAddNodesItem {
    parentNodeId?: ec.ExpandedNodeId;
    referenceTypeId?: ec.NodeId;
    requestedNewNodeId?: ec.ExpandedNodeId;
    browseName?: QualifiedName;
    nodeClass?: NodeClass;
    nodeAttributes?: ec.ExtensionObject;
    typeDefinition?: ec.ExpandedNodeId;
}
/**
A request to add a node to the server address space.
*/
export declare class AddNodesItem {
    parentNodeId: ec.ExpandedNodeId;
    referenceTypeId: ec.NodeId;
    requestedNewNodeId: ec.ExpandedNodeId;
    browseName: QualifiedName;
    nodeClass: NodeClass;
    nodeAttributes: ec.ExtensionObject;
    typeDefinition: ec.ExpandedNodeId;
    constructor(options?: IAddNodesItem);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: AddNodesItem): AddNodesItem;
}
export declare function decodeAddNodesItem(inp: DataStream): AddNodesItem;
