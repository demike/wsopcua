import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IBrowsePathTarget {
    targetId?: ec.ExpandedNodeId;
    remainingPathIndex?: ec.UInt32;
}
/**
The target of the translated path.
*/
export declare class BrowsePathTarget {
    targetId: ec.ExpandedNodeId;
    remainingPathIndex: ec.UInt32;
    constructor(options?: IBrowsePathTarget);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: BrowsePathTarget): BrowsePathTarget;
}
export declare function decodeBrowsePathTarget(inp: DataStream): BrowsePathTarget;
