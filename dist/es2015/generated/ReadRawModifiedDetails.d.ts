import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
import { HistoryReadDetails } from './HistoryReadDetails';
export interface IReadRawModifiedDetails {
    isReadModified?: boolean;
    startTime?: Date;
    endTime?: Date;
    numValuesPerNode?: ec.UInt32;
    returnBounds?: boolean;
}
/**

*/
export declare class ReadRawModifiedDetails extends HistoryReadDetails {
    isReadModified: boolean;
    startTime: Date;
    endTime: Date;
    numValuesPerNode: ec.UInt32;
    returnBounds: boolean;
    constructor(options?: IReadRawModifiedDetails);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ReadRawModifiedDetails): ReadRawModifiedDetails;
}
export declare function decodeReadRawModifiedDetails(inp: DataStream): ReadRawModifiedDetails;
