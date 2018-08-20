export var NamingRuleType;
(function (NamingRuleType) {
    NamingRuleType[NamingRuleType["Mandatory"] = 1] = "Mandatory";
    NamingRuleType[NamingRuleType["Optional"] = 2] = "Optional";
    NamingRuleType[NamingRuleType["Constraint"] = 3] = "Constraint";
})(NamingRuleType || (NamingRuleType = {}));
export function encodeNamingRuleType(data, out) {
    out.setUint32(data);
}
export function decodeNamingRuleType(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("NamingRuleType", NamingRuleType, encodeNamingRuleType, decodeNamingRuleType, null);
//# sourceMappingURL=NamingRuleType.js.map