export var TimestampsToReturn;
(function (TimestampsToReturn) {
    TimestampsToReturn[TimestampsToReturn["Source"] = 0] = "Source";
    TimestampsToReturn[TimestampsToReturn["Server"] = 1] = "Server";
    TimestampsToReturn[TimestampsToReturn["Both"] = 2] = "Both";
    TimestampsToReturn[TimestampsToReturn["Neither"] = 3] = "Neither";
    TimestampsToReturn[TimestampsToReturn["Invalid"] = 4] = "Invalid";
})(TimestampsToReturn || (TimestampsToReturn = {}));
export function encodeTimestampsToReturn(data, out) {
    out.setUint32(data);
}
export function decodeTimestampsToReturn(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("TimestampsToReturn", TimestampsToReturn, encodeTimestampsToReturn, decodeTimestampsToReturn, null);
//# sourceMappingURL=TimestampsToReturn.js.map