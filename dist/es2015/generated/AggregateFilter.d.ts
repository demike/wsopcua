import * as ec from '../basic-types';
import { AggregateConfiguration } from './AggregateConfiguration';
import { DataStream } from '../basic-types/DataStream';
import { MonitoringFilter } from './MonitoringFilter';
export interface IAggregateFilter {
    startTime?: Date;
    aggregateType?: ec.NodeId;
    processingInterval?: ec.Double;
    aggregateConfiguration?: AggregateConfiguration;
}
/**

*/
export declare class AggregateFilter extends MonitoringFilter {
    startTime: Date;
    aggregateType: ec.NodeId;
    processingInterval: ec.Double;
    aggregateConfiguration: AggregateConfiguration;
    constructor(options?: IAggregateFilter);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: AggregateFilter): AggregateFilter;
}
export declare function decodeAggregateFilter(inp: DataStream): AggregateFilter;
