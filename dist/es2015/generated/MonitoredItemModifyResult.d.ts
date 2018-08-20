import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IMonitoredItemModifyResult {
    statusCode?: ec.StatusCode;
    revisedSamplingInterval?: ec.Double;
    revisedQueueSize?: ec.UInt32;
    filterResult?: ec.ExtensionObject;
}
/**

*/
export declare class MonitoredItemModifyResult {
    statusCode: ec.StatusCode;
    revisedSamplingInterval: ec.Double;
    revisedQueueSize: ec.UInt32;
    filterResult: ec.ExtensionObject;
    constructor(options?: IMonitoredItemModifyResult);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: MonitoredItemModifyResult): MonitoredItemModifyResult;
}
export declare function decodeMonitoredItemModifyResult(inp: DataStream): MonitoredItemModifyResult;
