import { EUInformation } from './EUInformation';
import { Range } from './Range';
import { LocalizedText } from './LocalizedText';
import { AxisScaleEnumeration } from './AxisScaleEnumeration';
import * as ec from '../basic-types';
import { DataStream } from '../basic-types/DataStream';
export interface IAxisInformation {
    engineeringUnits?: EUInformation;
    eURange?: Range;
    title?: LocalizedText;
    axisScaleType?: AxisScaleEnumeration;
    axisSteps?: ec.Double[];
}
/**

*/
export declare class AxisInformation {
    engineeringUnits: EUInformation;
    eURange: Range;
    title: LocalizedText;
    axisScaleType: AxisScaleEnumeration;
    axisSteps: ec.Double[];
    constructor(options?: IAxisInformation);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: AxisInformation): AxisInformation;
}
export declare function decodeAxisInformation(inp: DataStream): AxisInformation;
