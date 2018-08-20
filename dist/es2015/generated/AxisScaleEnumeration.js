export var AxisScaleEnumeration;
(function (AxisScaleEnumeration) {
    AxisScaleEnumeration[AxisScaleEnumeration["Linear"] = 0] = "Linear";
    AxisScaleEnumeration[AxisScaleEnumeration["Log"] = 1] = "Log";
    AxisScaleEnumeration[AxisScaleEnumeration["Ln"] = 2] = "Ln";
})(AxisScaleEnumeration || (AxisScaleEnumeration = {}));
export function encodeAxisScaleEnumeration(data, out) {
    out.setUint32(data);
}
export function decodeAxisScaleEnumeration(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("AxisScaleEnumeration", AxisScaleEnumeration, encodeAxisScaleEnumeration, decodeAxisScaleEnumeration, null);
//# sourceMappingURL=AxisScaleEnumeration.js.map