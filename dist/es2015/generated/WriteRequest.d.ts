import { RequestHeader } from './RequestHeader';
import { WriteValue } from './WriteValue';
import { DataStream } from '../basic-types/DataStream';
export interface IWriteRequest {
    requestHeader?: RequestHeader;
    nodesToWrite?: WriteValue[];
}
/**

*/
export declare class WriteRequest {
    requestHeader: RequestHeader;
    nodesToWrite: WriteValue[];
    constructor(options?: IWriteRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: WriteRequest): WriteRequest;
}
export declare function decodeWriteRequest(inp: DataStream): WriteRequest;
