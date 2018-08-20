import * as ec from '../basic-types';
import { ServerState } from './ServerState';
import { BuildInfo } from './BuildInfo';
import { LocalizedText } from './LocalizedText';
import { DataStream } from '../basic-types/DataStream';
export interface IServerStatusDataType {
    startTime?: Date;
    currentTime?: Date;
    state?: ServerState;
    buildInfo?: BuildInfo;
    secondsTillShutdown?: ec.UInt32;
    shutdownReason?: LocalizedText;
}
/**

*/
export declare class ServerStatusDataType {
    startTime: Date;
    currentTime: Date;
    state: ServerState;
    buildInfo: BuildInfo;
    secondsTillShutdown: ec.UInt32;
    shutdownReason: LocalizedText;
    constructor(options?: IServerStatusDataType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ServerStatusDataType): ServerStatusDataType;
}
export declare function decodeServerStatusDataType(inp: DataStream): ServerStatusDataType;
