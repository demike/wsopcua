export var AccessLevelType;
(function (AccessLevelType) {
    AccessLevelType[AccessLevelType["None"] = 0] = "None";
    AccessLevelType[AccessLevelType["CurrentRead"] = 1] = "CurrentRead";
    AccessLevelType[AccessLevelType["CurrentWrite"] = 2] = "CurrentWrite";
    AccessLevelType[AccessLevelType["HistoryRead"] = 4] = "HistoryRead";
    AccessLevelType[AccessLevelType["HistoryWrite"] = 16] = "HistoryWrite";
    AccessLevelType[AccessLevelType["StatusWrite"] = 32] = "StatusWrite";
    AccessLevelType[AccessLevelType["TimestampWrite"] = 64] = "TimestampWrite";
})(AccessLevelType || (AccessLevelType = {}));
export function encodeAccessLevelType(data, out) {
    out.setUint32(data);
}
export function decodeAccessLevelType(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("AccessLevelType", AccessLevelType, encodeAccessLevelType, decodeAccessLevelType, null);
//# sourceMappingURL=AccessLevelType.js.map