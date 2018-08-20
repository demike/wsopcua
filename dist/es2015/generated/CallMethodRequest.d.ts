import * as ec from '../basic-types';
import { Variant } from '../variant';
import { DataStream } from '../basic-types/DataStream';
export interface ICallMethodRequest {
    objectId?: ec.NodeId;
    methodId?: ec.NodeId;
    inputArguments?: Variant[];
}
/**

*/
export declare class CallMethodRequest {
    objectId: ec.NodeId;
    methodId: ec.NodeId;
    inputArguments: Variant[];
    constructor(options?: ICallMethodRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: CallMethodRequest): CallMethodRequest;
}
export declare function decodeCallMethodRequest(inp: DataStream): CallMethodRequest;
