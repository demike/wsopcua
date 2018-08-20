export var DeadbandType;
(function (DeadbandType) {
    DeadbandType[DeadbandType["None"] = 0] = "None";
    DeadbandType[DeadbandType["Absolute"] = 1] = "Absolute";
    DeadbandType[DeadbandType["Percent"] = 2] = "Percent";
})(DeadbandType || (DeadbandType = {}));
export function encodeDeadbandType(data, out) {
    out.setUint32(data);
}
export function decodeDeadbandType(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("DeadbandType", DeadbandType, encodeDeadbandType, decodeDeadbandType, null);
//# sourceMappingURL=DeadbandType.js.map