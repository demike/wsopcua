export var OpenFileMode;
(function (OpenFileMode) {
    OpenFileMode[OpenFileMode["Read"] = 1] = "Read";
    OpenFileMode[OpenFileMode["Write"] = 2] = "Write";
    OpenFileMode[OpenFileMode["EraseExisting"] = 4] = "EraseExisting";
    OpenFileMode[OpenFileMode["Append"] = 8] = "Append";
})(OpenFileMode || (OpenFileMode = {}));
export function encodeOpenFileMode(data, out) {
    out.setUint32(data);
}
export function decodeOpenFileMode(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("OpenFileMode", OpenFileMode, encodeOpenFileMode, decodeOpenFileMode, null);
//# sourceMappingURL=OpenFileMode.js.map