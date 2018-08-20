export var AccessLevelExType;
(function (AccessLevelExType) {
    AccessLevelExType[AccessLevelExType["None"] = 0] = "None";
    AccessLevelExType[AccessLevelExType["CurrentRead"] = 1] = "CurrentRead";
    AccessLevelExType[AccessLevelExType["CurrentWrite"] = 2] = "CurrentWrite";
    AccessLevelExType[AccessLevelExType["HistoryRead"] = 4] = "HistoryRead";
    AccessLevelExType[AccessLevelExType["HistoryWrite"] = 16] = "HistoryWrite";
    AccessLevelExType[AccessLevelExType["StatusWrite"] = 32] = "StatusWrite";
    AccessLevelExType[AccessLevelExType["TimestampWrite"] = 64] = "TimestampWrite";
    AccessLevelExType[AccessLevelExType["NonatomicRead"] = 65536] = "NonatomicRead";
    AccessLevelExType[AccessLevelExType["NonatomicWrite"] = 131072] = "NonatomicWrite";
    AccessLevelExType[AccessLevelExType["WriteFullArrayOnly"] = 262144] = "WriteFullArrayOnly";
})(AccessLevelExType || (AccessLevelExType = {}));
export function encodeAccessLevelExType(data, out) {
    out.setUint32(data);
}
export function decodeAccessLevelExType(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("AccessLevelExType", AccessLevelExType, encodeAccessLevelExType, decodeAccessLevelExType, null);
//# sourceMappingURL=AccessLevelExType.js.map