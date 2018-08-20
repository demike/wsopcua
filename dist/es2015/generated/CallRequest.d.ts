import { RequestHeader } from './RequestHeader';
import { CallMethodRequest } from './CallMethodRequest';
import { DataStream } from '../basic-types/DataStream';
export interface ICallRequest {
    requestHeader?: RequestHeader;
    methodsToCall?: CallMethodRequest[];
}
/**

*/
export declare class CallRequest {
    requestHeader: RequestHeader;
    methodsToCall: CallMethodRequest[];
    constructor(options?: ICallRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: CallRequest): CallRequest;
}
export declare function decodeCallRequest(inp: DataStream): CallRequest;
