export var DataChangeTrigger;
(function (DataChangeTrigger) {
    DataChangeTrigger[DataChangeTrigger["Status"] = 0] = "Status";
    DataChangeTrigger[DataChangeTrigger["StatusValue"] = 1] = "StatusValue";
    DataChangeTrigger[DataChangeTrigger["StatusValueTimestamp"] = 2] = "StatusValueTimestamp";
})(DataChangeTrigger || (DataChangeTrigger = {}));
export function encodeDataChangeTrigger(data, out) {
    out.setUint32(data);
}
export function decodeDataChangeTrigger(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("DataChangeTrigger", DataChangeTrigger, encodeDataChangeTrigger, decodeDataChangeTrigger, null);
//# sourceMappingURL=DataChangeTrigger.js.map