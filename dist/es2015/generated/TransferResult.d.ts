import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface ITransferResult {
    statusCode?: ec.StatusCode;
    availableSequenceNumbers?: ec.UInt32[];
}
/**

*/
export declare class TransferResult {
    statusCode: ec.StatusCode;
    availableSequenceNumbers: ec.UInt32[];
    constructor(options?: ITransferResult);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: TransferResult): TransferResult;
}
export declare function decodeTransferResult(inp: DataStream): TransferResult;
