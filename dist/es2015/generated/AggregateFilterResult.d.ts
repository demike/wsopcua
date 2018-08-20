import * as ec from '../basic-types';
import { AggregateConfiguration } from './AggregateConfiguration';
import { DataStream } from '../basic-types/DataStream';
import { MonitoringFilterResult } from './MonitoringFilterResult';
export interface IAggregateFilterResult {
    revisedStartTime?: Date;
    revisedProcessingInterval?: ec.Double;
    revisedAggregateConfiguration?: AggregateConfiguration;
}
/**

*/
export declare class AggregateFilterResult extends MonitoringFilterResult {
    revisedStartTime: Date;
    revisedProcessingInterval: ec.Double;
    revisedAggregateConfiguration: AggregateConfiguration;
    constructor(options?: IAggregateFilterResult);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: AggregateFilterResult): AggregateFilterResult;
}
export declare function decodeAggregateFilterResult(inp: DataStream): AggregateFilterResult;
