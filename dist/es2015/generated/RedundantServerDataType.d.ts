import * as ec from '../basic-types';
import { ServerState } from './ServerState';
import { DataStream } from '../basic-types/DataStream';
export interface IRedundantServerDataType {
    serverId?: string;
    serviceLevel?: ec.Byte;
    serverState?: ServerState;
}
/**

*/
export declare class RedundantServerDataType {
    serverId: string;
    serviceLevel: ec.Byte;
    serverState: ServerState;
    constructor(options?: IRedundantServerDataType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: RedundantServerDataType): RedundantServerDataType;
}
export declare function decodeRedundantServerDataType(inp: DataStream): RedundantServerDataType;
