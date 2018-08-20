import * as ec from '../basic-types';
import { MonitoringParameters } from './MonitoringParameters';
import { DataStream } from '../basic-types/DataStream';
export interface IMonitoredItemModifyRequest {
    monitoredItemId?: ec.UInt32;
    requestedParameters?: MonitoringParameters;
}
/**

*/
export declare class MonitoredItemModifyRequest {
    monitoredItemId: ec.UInt32;
    requestedParameters: MonitoringParameters;
    constructor(options?: IMonitoredItemModifyRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: MonitoredItemModifyRequest): MonitoredItemModifyRequest;
}
export declare function decodeMonitoredItemModifyRequest(inp: DataStream): MonitoredItemModifyRequest;
