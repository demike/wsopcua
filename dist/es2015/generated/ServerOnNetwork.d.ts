import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IServerOnNetwork {
    recordId?: ec.UInt32;
    serverName?: string;
    discoveryUrl?: string;
    serverCapabilities?: string[];
}
/**

*/
export declare class ServerOnNetwork {
    recordId: ec.UInt32;
    serverName: string;
    discoveryUrl: string;
    serverCapabilities: string[];
    constructor(options?: IServerOnNetwork);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ServerOnNetwork): ServerOnNetwork;
}
export declare function decodeServerOnNetwork(inp: DataStream): ServerOnNetwork;
