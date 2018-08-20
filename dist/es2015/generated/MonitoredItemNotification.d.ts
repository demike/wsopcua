import * as ec from '../basic-types';
import { DataValue } from './DataValue';
import { DataStream } from '../basic-types/DataStream';
export interface IMonitoredItemNotification {
    clientHandle?: ec.UInt32;
    value?: DataValue;
}
/**

*/
export declare class MonitoredItemNotification {
    clientHandle: ec.UInt32;
    value: DataValue;
    constructor(options?: IMonitoredItemNotification);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: MonitoredItemNotification): MonitoredItemNotification;
}
export declare function decodeMonitoredItemNotification(inp: DataStream): MonitoredItemNotification;
