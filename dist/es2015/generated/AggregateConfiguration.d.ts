import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IAggregateConfiguration {
    useServerCapabilitiesDefaults?: boolean;
    treatUncertainAsBad?: boolean;
    percentDataBad?: ec.Byte;
    percentDataGood?: ec.Byte;
    useSlopedExtrapolation?: boolean;
}
/**

*/
export declare class AggregateConfiguration {
    useServerCapabilitiesDefaults: boolean;
    treatUncertainAsBad: boolean;
    percentDataBad: ec.Byte;
    percentDataGood: ec.Byte;
    useSlopedExtrapolation: boolean;
    constructor(options?: IAggregateConfiguration);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: AggregateConfiguration): AggregateConfiguration;
}
export declare function decodeAggregateConfiguration(inp: DataStream): AggregateConfiguration;
