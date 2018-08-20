import { IdentityCriteriaType } from './IdentityCriteriaType';
import { DataStream } from '../basic-types/DataStream';
export interface IIdentityMappingRuleType {
    criteriaType?: IdentityCriteriaType;
    criteria?: string;
}
/**

*/
export declare class IdentityMappingRuleType {
    criteriaType: IdentityCriteriaType;
    criteria: string;
    constructor(options?: IIdentityMappingRuleType);
    encode(out: DataStream): void;
    decode(inp: DataStream): void;
    clone(target?: IdentityMappingRuleType): IdentityMappingRuleType;
}
export declare function decodeIdentityMappingRuleType(inp: DataStream): IdentityMappingRuleType;
