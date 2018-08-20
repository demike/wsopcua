import { DataStream } from '../basic-types/DataStream';
export declare enum MonitoringMode {
    Disabled = 0,
    Sampling = 1,
    Reporting = 2
}
export declare function encodeMonitoringMode(data: MonitoringMode, out: DataStream): void;
export declare function decodeMonitoringMode(inp: DataStream): number;
