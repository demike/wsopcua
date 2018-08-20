import { encodeIdentityCriteriaType, decodeIdentityCriteriaType } from './IdentityCriteriaType';
import * as ec from '../basic-types';
/**

*/
export class IdentityMappingRuleType {
    constructor(options) {
        options = options || {};
        this.criteriaType = (options.criteriaType) ? options.criteriaType : null;
        this.criteria = (options.criteria) ? options.criteria : null;
    }
    encode(out) {
        encodeIdentityCriteriaType(this.criteriaType, out);
        ec.encodeString(this.criteria, out);
    }
    decode(inp) {
        this.criteriaType = decodeIdentityCriteriaType(inp);
        this.criteria = ec.decodeString(inp);
    }
    clone(target) {
        if (!target) {
            target = new IdentityMappingRuleType();
        }
        target.criteriaType = this.criteriaType;
        target.criteria = this.criteria;
        return target;
    }
}
export function decodeIdentityMappingRuleType(inp) {
    let obj = new IdentityMappingRuleType();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("IdentityMappingRuleType", IdentityMappingRuleType, makeExpandedNodeId(15736, 0));
//# sourceMappingURL=IdentityMappingRuleType.js.map