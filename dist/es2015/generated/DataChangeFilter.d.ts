import { DataChangeTrigger } from './DataChangeTrigger';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
import { MonitoringFilter } from './MonitoringFilter';
export interface IDataChangeFilter {
    trigger?: DataChangeTrigger;
    deadbandType?: ec.UInt32;
    deadbandValue?: ec.Double;
}
/**

*/
export declare class DataChangeFilter extends MonitoringFilter {
    trigger: DataChangeTrigger;
    deadbandType: ec.UInt32;
    deadbandValue: ec.Double;
    constructor(options?: IDataChangeFilter);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: DataChangeFilter): DataChangeFilter;
}
export declare function decodeDataChangeFilter(inp: DataStream): DataChangeFilter;
