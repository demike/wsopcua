import { EventFieldList } from './EventFieldList';
import { DataStream } from '../basic-types/DataStream';
import { NotificationData } from './NotificationData';
export interface IEventNotificationList {
    events?: EventFieldList[];
}
/**

*/
export declare class EventNotificationList extends NotificationData {
    events: EventFieldList[];
    constructor(options?: IEventNotificationList);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: EventNotificationList): EventNotificationList;
}
export declare function decodeEventNotificationList(inp: DataStream): EventNotificationList;
