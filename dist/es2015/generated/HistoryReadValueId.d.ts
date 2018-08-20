import * as ec from '../basic-types';
import { QualifiedName } from './QualifiedName';
import { DataStream } from '../basic-types/DataStream';
export interface IHistoryReadValueId {
    nodeId?: ec.NodeId;
    indexRange?: string;
    dataEncoding?: QualifiedName;
    continuationPoint?: Uint8Array;
}
/**

*/
export declare class HistoryReadValueId {
    nodeId: ec.NodeId;
    indexRange: string;
    dataEncoding: QualifiedName;
    continuationPoint: Uint8Array;
    constructor(options?: IHistoryReadValueId);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: HistoryReadValueId): HistoryReadValueId;
}
export declare function decodeHistoryReadValueId(inp: DataStream): HistoryReadValueId;
