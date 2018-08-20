import { DataValue } from '../generated/DataValue';
import { TimestampsToReturn } from '../generated/TimestampsToReturn';
export declare function apply_timestamps(dataValue: any, timestampsToReturn: any, attributeId: any): DataValue;
export declare function extractRange(dataValue: any, indexRange: any): any;
export declare function sourceTimestampHasChanged(dataValue1: any, dataValue2: any): boolean;
export declare function serverTimestampHasChanged(dataValue1: any, dataValue2: any): boolean;
export declare function timestampHasChanged(dataValue1: any, dataValue2: any, timestampsToReturn: any): boolean;
/**
 *
 * @param v1 {DataValue}
 * @param v2 {DataValue}
 * @param [timestampsToReturn {TimestampsToReturn}]
 * @return {boolean} true if data values are identical
 */
export declare function sameDataValue(v1: DataValue, v2: DataValue, timestampsToReturn: TimestampsToReturn): boolean;
