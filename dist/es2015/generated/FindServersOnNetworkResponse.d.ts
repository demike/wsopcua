import { ResponseHeader } from './ResponseHeader';
import { ServerOnNetwork } from './ServerOnNetwork';
import { DataStream } from '../basic-types/DataStream';
export interface IFindServersOnNetworkResponse {
    responseHeader?: ResponseHeader;
    lastCounterResetTime?: Date;
    servers?: ServerOnNetwork[];
}
/**

*/
export declare class FindServersOnNetworkResponse {
    responseHeader: ResponseHeader;
    lastCounterResetTime: Date;
    servers: ServerOnNetwork[];
    constructor(options?: IFindServersOnNetworkResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: FindServersOnNetworkResponse): FindServersOnNetworkResponse;
}
export declare function decodeFindServersOnNetworkResponse(inp: DataStream): FindServersOnNetworkResponse;
