export var ExceptionDeviationFormat;
(function (ExceptionDeviationFormat) {
    ExceptionDeviationFormat[ExceptionDeviationFormat["AbsoluteValue"] = 0] = "AbsoluteValue";
    ExceptionDeviationFormat[ExceptionDeviationFormat["PercentOfValue"] = 1] = "PercentOfValue";
    ExceptionDeviationFormat[ExceptionDeviationFormat["PercentOfRange"] = 2] = "PercentOfRange";
    ExceptionDeviationFormat[ExceptionDeviationFormat["PercentOfEURange"] = 3] = "PercentOfEURange";
    ExceptionDeviationFormat[ExceptionDeviationFormat["Unknown"] = 4] = "Unknown";
})(ExceptionDeviationFormat || (ExceptionDeviationFormat = {}));
export function encodeExceptionDeviationFormat(data, out) {
    out.setUint32(data);
}
export function decodeExceptionDeviationFormat(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("ExceptionDeviationFormat", ExceptionDeviationFormat, encodeExceptionDeviationFormat, decodeExceptionDeviationFormat, null);
//# sourceMappingURL=ExceptionDeviationFormat.js.map