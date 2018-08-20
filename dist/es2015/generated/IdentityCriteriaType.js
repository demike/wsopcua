export var IdentityCriteriaType;
(function (IdentityCriteriaType) {
    IdentityCriteriaType[IdentityCriteriaType["UserName"] = 1] = "UserName";
    IdentityCriteriaType[IdentityCriteriaType["Thumbprint"] = 2] = "Thumbprint";
    IdentityCriteriaType[IdentityCriteriaType["Role"] = 3] = "Role";
    IdentityCriteriaType[IdentityCriteriaType["GroupId"] = 4] = "GroupId";
    IdentityCriteriaType[IdentityCriteriaType["Anonymous"] = 5] = "Anonymous";
    IdentityCriteriaType[IdentityCriteriaType["AuthenticatedUser"] = 6] = "AuthenticatedUser";
})(IdentityCriteriaType || (IdentityCriteriaType = {}));
export function encodeIdentityCriteriaType(data, out) {
    out.setUint32(data);
}
export function decodeIdentityCriteriaType(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("IdentityCriteriaType", IdentityCriteriaType, encodeIdentityCriteriaType, decodeIdentityCriteriaType, null);
//# sourceMappingURL=IdentityCriteriaType.js.map