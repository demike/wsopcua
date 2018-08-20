import { DeadbandType } from '../generated/DeadbandType';
import { Variant } from '../variant';
/**
 * @method check_deadband
 * @param variant1 {Variant}
 * @param variant2 {Variant}
 * @param deadbandType  {DeadbandType}
 * @param deadbandValue {Float}
 * @param valueRange    {Float}
 * @return {boolean}
 */
export declare function check_deadband(variant1: Variant, variant2: Variant, deadbandType: DeadbandType, deadbandValue: number, valueRange?: number): any;
