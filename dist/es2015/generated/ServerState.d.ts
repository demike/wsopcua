import { DataStream } from '../basic-types/DataStream';
export declare enum ServerState {
    Running = 0,
    Failed = 1,
    NoConfiguration = 2,
    Suspended = 3,
    Shutdown = 4,
    Test = 5,
    CommunicationFault = 6,
    Unknown = 7
}
export declare function encodeServerState(data: ServerState, out: DataStream): void;
export declare function decodeServerState(inp: DataStream): number;
