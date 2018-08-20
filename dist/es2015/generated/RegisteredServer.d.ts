import { LocalizedText } from './LocalizedText';
import { ApplicationType } from './ApplicationType';
import { DataStream } from '../basic-types/DataStream';
export interface IRegisteredServer {
    serverUri?: string;
    productUri?: string;
    serverNames?: LocalizedText[];
    serverType?: ApplicationType;
    gatewayServerUri?: string;
    discoveryUrls?: string[];
    semaphoreFilePath?: string;
    isOnline?: boolean;
}
/**
The information required to register a server with a discovery server.
*/
export declare class RegisteredServer {
    serverUri: string;
    productUri: string;
    serverNames: LocalizedText[];
    serverType: ApplicationType;
    gatewayServerUri: string;
    discoveryUrls: string[];
    semaphoreFilePath: string;
    isOnline: boolean;
    constructor(options?: IRegisteredServer);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: RegisteredServer): RegisteredServer;
}
export declare function decodeRegisteredServer(inp: DataStream): RegisteredServer;
