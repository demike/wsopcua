import { ResponseHeader } from './ResponseHeader';
import { DataStream } from '../basic-types/DataStream';
export interface IServiceFault {
    responseHeader?: ResponseHeader;
}
/**
The response returned by all services when there is a service level error.
*/
export declare class ServiceFault {
    responseHeader: ResponseHeader;
    constructor(options?: IServiceFault);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ServiceFault): ServiceFault;
}
export declare function decodeServiceFault(inp: DataStream): ServiceFault;
