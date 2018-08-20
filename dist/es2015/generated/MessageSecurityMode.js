/**
The type of security to use on a message.*/
export var MessageSecurityMode;
(function (MessageSecurityMode) {
    MessageSecurityMode[MessageSecurityMode["Invalid"] = 0] = "Invalid";
    MessageSecurityMode[MessageSecurityMode["None"] = 1] = "None";
    MessageSecurityMode[MessageSecurityMode["Sign"] = 2] = "Sign";
    MessageSecurityMode[MessageSecurityMode["SignAndEncrypt"] = 3] = "SignAndEncrypt";
})(MessageSecurityMode || (MessageSecurityMode = {}));
export function encodeMessageSecurityMode(data, out) {
    out.setUint32(data);
}
export function decodeMessageSecurityMode(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("MessageSecurityMode", MessageSecurityMode, encodeMessageSecurityMode, decodeMessageSecurityMode, null);
//# sourceMappingURL=MessageSecurityMode.js.map