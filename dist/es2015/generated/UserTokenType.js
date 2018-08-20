/**
The possible user token types.*/
export var UserTokenType;
(function (UserTokenType) {
    UserTokenType[UserTokenType["Anonymous"] = 0] = "Anonymous";
    UserTokenType[UserTokenType["UserName"] = 1] = "UserName";
    UserTokenType[UserTokenType["Certificate"] = 2] = "Certificate";
    UserTokenType[UserTokenType["IssuedToken"] = 3] = "IssuedToken";
})(UserTokenType || (UserTokenType = {}));
export function encodeUserTokenType(data, out) {
    out.setUint32(data);
}
export function decodeUserTokenType(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("UserTokenType", UserTokenType, encodeUserTokenType, decodeUserTokenType, null);
//# sourceMappingURL=UserTokenType.js.map