import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IEndpointConfiguration {
    operationTimeout?: ec.Int32;
    useBinaryEncoding?: boolean;
    maxStringLength?: ec.Int32;
    maxByteStringLength?: ec.Int32;
    maxArrayLength?: ec.Int32;
    maxMessageSize?: ec.Int32;
    maxBufferSize?: ec.Int32;
    channelLifetime?: ec.Int32;
    securityTokenLifetime?: ec.Int32;
}
/**

*/
export declare class EndpointConfiguration {
    operationTimeout: ec.Int32;
    useBinaryEncoding: boolean;
    maxStringLength: ec.Int32;
    maxByteStringLength: ec.Int32;
    maxArrayLength: ec.Int32;
    maxMessageSize: ec.Int32;
    maxBufferSize: ec.Int32;
    channelLifetime: ec.Int32;
    securityTokenLifetime: ec.Int32;
    constructor(options?: IEndpointConfiguration);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: EndpointConfiguration): EndpointConfiguration;
}
export declare function decodeEndpointConfiguration(inp: DataStream): EndpointConfiguration;
