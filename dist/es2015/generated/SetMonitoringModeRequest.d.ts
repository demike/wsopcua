import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
import { MonitoringMode } from './MonitoringMode';
import { DataStream } from '../basic-types/DataStream';
export interface ISetMonitoringModeRequest {
    requestHeader?: RequestHeader;
    subscriptionId?: ec.UInt32;
    monitoringMode?: MonitoringMode;
    monitoredItemIds?: ec.UInt32[];
}
/**

*/
export declare class SetMonitoringModeRequest {
    requestHeader: RequestHeader;
    subscriptionId: ec.UInt32;
    monitoringMode: MonitoringMode;
    monitoredItemIds: ec.UInt32[];
    constructor(options?: ISetMonitoringModeRequest);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: SetMonitoringModeRequest): SetMonitoringModeRequest;
}
export declare function decodeSetMonitoringModeRequest(inp: DataStream): SetMonitoringModeRequest;
