import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface INotificationMessage {
    sequenceNumber?: ec.UInt32;
    publishTime?: Date;
    notificationData?: ec.ExtensionObject[];
}
/**

*/
export declare class NotificationMessage {
    sequenceNumber: ec.UInt32;
    publishTime: Date;
    notificationData: ec.ExtensionObject[];
    constructor(options?: INotificationMessage);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: NotificationMessage): NotificationMessage;
}
export declare function decodeNotificationMessage(inp: DataStream): NotificationMessage;
