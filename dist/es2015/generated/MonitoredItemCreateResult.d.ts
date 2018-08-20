import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IMonitoredItemCreateResult {
    statusCode?: ec.StatusCode;
    monitoredItemId?: ec.UInt32;
    revisedSamplingInterval?: ec.Double;
    revisedQueueSize?: ec.UInt32;
    filterResult?: ec.ExtensionObject;
}
/**

*/
export declare class MonitoredItemCreateResult {
    statusCode: ec.StatusCode;
    monitoredItemId: ec.UInt32;
    revisedSamplingInterval: ec.Double;
    revisedQueueSize: ec.UInt32;
    filterResult: ec.ExtensionObject;
    constructor(options?: IMonitoredItemCreateResult);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: MonitoredItemCreateResult): MonitoredItemCreateResult;
}
export declare function decodeMonitoredItemCreateResult(inp: DataStream): MonitoredItemCreateResult;
