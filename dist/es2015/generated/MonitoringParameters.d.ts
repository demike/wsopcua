import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IMonitoringParameters {
    clientHandle?: ec.UInt32;
    samplingInterval?: ec.Double;
    filter?: ec.ExtensionObject;
    queueSize?: ec.UInt32;
    discardOldest?: boolean;
}
/**

*/
export declare class MonitoringParameters {
    clientHandle: ec.UInt32;
    samplingInterval: ec.Double;
    filter: ec.ExtensionObject;
    queueSize: ec.UInt32;
    discardOldest: boolean;
    constructor(options?: IMonitoringParameters);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: MonitoringParameters): MonitoringParameters;
}
export declare function decodeMonitoringParameters(inp: DataStream): MonitoringParameters;
