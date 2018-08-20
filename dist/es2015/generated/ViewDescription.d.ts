import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IViewDescription {
    viewId?: ec.NodeId;
    timestamp?: Date;
    viewVersion?: ec.UInt32;
}
/**
The view to browse.
*/
export declare class ViewDescription {
    viewId: ec.NodeId;
    timestamp: Date;
    viewVersion: ec.UInt32;
    constructor(options?: IViewDescription);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ViewDescription): ViewDescription;
}
export declare function decodeViewDescription(inp: DataStream): ViewDescription;
