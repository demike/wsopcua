import { ResponseHeader } from './ResponseHeader';
import { NotificationMessage } from './NotificationMessage';
import { DataStream } from '../basic-types/DataStream';
export interface IRepublishResponse {
    responseHeader?: ResponseHeader;
    notificationMessage?: NotificationMessage;
}
/**

*/
export declare class RepublishResponse {
    responseHeader: ResponseHeader;
    notificationMessage: NotificationMessage;
    constructor(options?: IRepublishResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: RepublishResponse): RepublishResponse;
}
export declare function decodeRepublishResponse(inp: DataStream): RepublishResponse;
