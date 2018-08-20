export var HistoryUpdateType;
(function (HistoryUpdateType) {
    HistoryUpdateType[HistoryUpdateType["Insert"] = 1] = "Insert";
    HistoryUpdateType[HistoryUpdateType["Replace"] = 2] = "Replace";
    HistoryUpdateType[HistoryUpdateType["Update"] = 3] = "Update";
    HistoryUpdateType[HistoryUpdateType["Delete"] = 4] = "Delete";
})(HistoryUpdateType || (HistoryUpdateType = {}));
export function encodeHistoryUpdateType(data, out) {
    out.setUint32(data);
}
export function decodeHistoryUpdateType(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("HistoryUpdateType", HistoryUpdateType, encodeHistoryUpdateType, decodeHistoryUpdateType, null);
//# sourceMappingURL=HistoryUpdateType.js.map