import { DataStream } from '../basic-types/DataStream';
/**
The types of applications.*/
export declare enum ApplicationType {
    Server = 0,
    Client = 1,
    ClientAndServer = 2,
    DiscoveryServer = 3
}
export declare function encodeApplicationType(data: ApplicationType, out: DataStream): void;
export declare function decodeApplicationType(inp: DataStream): number;
