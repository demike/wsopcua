import * as ec from '../basic-types';
import { AggregateConfiguration } from './AggregateConfiguration';
import { DataStream } from '../basic-types/DataStream';
import { HistoryReadDetails } from './HistoryReadDetails';
export interface IReadProcessedDetails {
    startTime?: Date;
    endTime?: Date;
    processingInterval?: ec.Double;
    aggregateType?: ec.NodeId[];
    aggregateConfiguration?: AggregateConfiguration;
}
/**

*/
export declare class ReadProcessedDetails extends HistoryReadDetails {
    startTime: Date;
    endTime: Date;
    processingInterval: ec.Double;
    aggregateType: ec.NodeId[];
    aggregateConfiguration: AggregateConfiguration;
    constructor(options?: IReadProcessedDetails);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: ReadProcessedDetails): ReadProcessedDetails;
}
export declare function decodeReadProcessedDetails(inp: DataStream): ReadProcessedDetails;
