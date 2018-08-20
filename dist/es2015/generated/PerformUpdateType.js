export var PerformUpdateType;
(function (PerformUpdateType) {
    PerformUpdateType[PerformUpdateType["Insert"] = 1] = "Insert";
    PerformUpdateType[PerformUpdateType["Replace"] = 2] = "Replace";
    PerformUpdateType[PerformUpdateType["Update"] = 3] = "Update";
    PerformUpdateType[PerformUpdateType["Remove"] = 4] = "Remove";
})(PerformUpdateType || (PerformUpdateType = {}));
export function encodePerformUpdateType(data, out) {
    out.setUint32(data);
}
export function decodePerformUpdateType(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("PerformUpdateType", PerformUpdateType, encodePerformUpdateType, decodePerformUpdateType, null);
//# sourceMappingURL=PerformUpdateType.js.map