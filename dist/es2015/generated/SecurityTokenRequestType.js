/**
Indicates whether a token if being created or renewed.*/
export var SecurityTokenRequestType;
(function (SecurityTokenRequestType) {
    SecurityTokenRequestType[SecurityTokenRequestType["Issue"] = 0] = "Issue";
    SecurityTokenRequestType[SecurityTokenRequestType["Renew"] = 1] = "Renew";
})(SecurityTokenRequestType || (SecurityTokenRequestType = {}));
export function encodeSecurityTokenRequestType(data, out) {
    out.setUint32(data);
}
export function decodeSecurityTokenRequestType(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("SecurityTokenRequestType", SecurityTokenRequestType, encodeSecurityTokenRequestType, decodeSecurityTokenRequestType, null);
//# sourceMappingURL=SecurityTokenRequestType.js.map