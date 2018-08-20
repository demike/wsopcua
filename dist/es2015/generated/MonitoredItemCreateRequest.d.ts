import { ReadValueId } from './ReadValueId';
import { MonitoringMode } from './MonitoringMode';
import { MonitoringParameters } from './MonitoringParameters';
import { DataStream } from '../basic-types/DataStream';
export interface IMonitoredItemCreateRequest {
    itemToMonitor?: ReadValueId;
    monitoringMode?: MonitoringMode;
    requestedParameters?: MonitoringParameters;
}
/**

*/
export declare class MonitoredItemCreateRequest {
    itemToMonitor: ReadValueId;
    monitoringMode: MonitoringMode;
    requestedParameters: MonitoringParameters;
    constructor(options?: IMonitoredItemCreateRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: MonitoredItemCreateRequest): MonitoredItemCreateRequest;
}
export declare function decodeMonitoredItemCreateRequest(inp: DataStream): MonitoredItemCreateRequest;
