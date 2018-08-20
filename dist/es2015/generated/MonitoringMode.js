export var MonitoringMode;
(function (MonitoringMode) {
    MonitoringMode[MonitoringMode["Disabled"] = 0] = "Disabled";
    MonitoringMode[MonitoringMode["Sampling"] = 1] = "Sampling";
    MonitoringMode[MonitoringMode["Reporting"] = 2] = "Reporting";
})(MonitoringMode || (MonitoringMode = {}));
export function encodeMonitoringMode(data, out) {
    out.setUint32(data);
}
export function decodeMonitoringMode(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("MonitoringMode", MonitoringMode, encodeMonitoringMode, decodeMonitoringMode, null);
//# sourceMappingURL=MonitoringMode.js.map