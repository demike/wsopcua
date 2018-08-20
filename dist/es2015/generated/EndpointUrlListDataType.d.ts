import { DataStream } from '../basic-types/DataStream';
export interface IEndpointUrlListDataType {
    endpointUrlList?: string[];
}
/**

*/
export declare class EndpointUrlListDataType {
    endpointUrlList: string[];
    constructor(options?: IEndpointUrlListDataType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: EndpointUrlListDataType): EndpointUrlListDataType;
}
export declare function decodeEndpointUrlListDataType(inp: DataStream): EndpointUrlListDataType;
