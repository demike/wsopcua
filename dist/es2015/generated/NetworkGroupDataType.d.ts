import { EndpointUrlListDataType } from './EndpointUrlListDataType';
import { DataStream } from '../basic-types/DataStream';
export interface INetworkGroupDataType {
    serverUri?: string;
    networkPaths?: EndpointUrlListDataType[];
}
/**

*/
export declare class NetworkGroupDataType {
    serverUri: string;
    networkPaths: EndpointUrlListDataType[];
    constructor(options?: INetworkGroupDataType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: NetworkGroupDataType): NetworkGroupDataType;
}
export declare function decodeNetworkGroupDataType(inp: DataStream): NetworkGroupDataType;
