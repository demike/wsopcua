import { ResponseHeader } from './ResponseHeader';
import { ApplicationDescription } from './ApplicationDescription';
import { DataStream } from '../basic-types/DataStream';
export interface IFindServersResponse {
    responseHeader?: ResponseHeader;
    servers?: ApplicationDescription[];
}
/**
Finds the servers known to the discovery server.
*/
export declare class FindServersResponse {
    responseHeader: ResponseHeader;
    servers: ApplicationDescription[];
    constructor(options?: IFindServersResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: FindServersResponse): FindServersResponse;
}
export declare function decodeFindServersResponse(inp: DataStream): FindServersResponse;
