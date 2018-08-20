import * as ec from '../basic-types';
import { BrowseDirection } from './BrowseDirection';
import { DataStream } from '../basic-types/DataStream';
export interface IBrowseDescription {
    nodeId?: ec.NodeId;
    browseDirection?: BrowseDirection;
    referenceTypeId?: ec.NodeId;
    includeSubtypes?: boolean;
    nodeClassMask?: ec.UInt32;
    resultMask?: ec.UInt32;
}
/**
A request to browse the the references from a node.
*/
export declare class BrowseDescription {
    nodeId: ec.NodeId;
    browseDirection: BrowseDirection;
    referenceTypeId: ec.NodeId;
    includeSubtypes: boolean;
    nodeClassMask: ec.UInt32;
    resultMask: ec.UInt32;
    constructor(options?: IBrowseDescription);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: BrowseDescription): BrowseDescription;
}
export declare function decodeBrowseDescription(inp: DataStream): BrowseDescription;
