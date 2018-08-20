import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface ISamplingIntervalDiagnosticsDataType {
    samplingInterval?: ec.Double;
    monitoredItemCount?: ec.UInt32;
    maxMonitoredItemCount?: ec.UInt32;
    disabledMonitoredItemCount?: ec.UInt32;
}
/**

*/
export declare class SamplingIntervalDiagnosticsDataType {
    samplingInterval: ec.Double;
    monitoredItemCount: ec.UInt32;
    maxMonitoredItemCount: ec.UInt32;
    disabledMonitoredItemCount: ec.UInt32;
    constructor(options?: ISamplingIntervalDiagnosticsDataType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: SamplingIntervalDiagnosticsDataType): SamplingIntervalDiagnosticsDataType;
}
export declare function decodeSamplingIntervalDiagnosticsDataType(inp: DataStream): SamplingIntervalDiagnosticsDataType;
