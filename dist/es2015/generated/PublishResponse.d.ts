import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
import { NotificationMessage } from './NotificationMessage';
import { DiagnosticInfo } from './DiagnosticInfo';
import { DataStream } from '../basic-types/DataStream';
export interface IPublishResponse {
    responseHeader?: ResponseHeader;
    subscriptionId?: ec.UInt32;
    availableSequenceNumbers?: ec.UInt32[];
    moreNotifications?: boolean;
    notificationMessage?: NotificationMessage;
    results?: ec.StatusCode[];
    diagnosticInfos?: DiagnosticInfo[];
}
/**

*/
export declare class PublishResponse {
    responseHeader: ResponseHeader;
    subscriptionId: ec.UInt32;
    availableSequenceNumbers: ec.UInt32[];
    moreNotifications: boolean;
    notificationMessage: NotificationMessage;
    results: ec.StatusCode[];
    diagnosticInfos: DiagnosticInfo[];
    constructor(options?: IPublishResponse);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: PublishResponse): PublishResponse;
}
export declare function decodePublishResponse(inp: DataStream): PublishResponse;
