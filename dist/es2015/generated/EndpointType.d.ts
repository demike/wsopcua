import { MessageSecurityMode } from './MessageSecurityMode';
import { DataStream } from '../basic-types/DataStream';
export interface IEndpointType {
    endpointUrl?: string;
    securityMode?: MessageSecurityMode;
    securityPolicyUri?: string;
    transportProfileUri?: string;
}
/**

*/
export declare class EndpointType {
    endpointUrl: string;
    securityMode: MessageSecurityMode;
    securityPolicyUri: string;
    transportProfileUri: string;
    constructor(options?: IEndpointType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: EndpointType): EndpointType;
}
export declare function decodeEndpointType(inp: DataStream): EndpointType;
