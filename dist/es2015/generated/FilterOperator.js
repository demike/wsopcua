export var FilterOperator;
(function (FilterOperator) {
    FilterOperator[FilterOperator["Equals"] = 0] = "Equals";
    FilterOperator[FilterOperator["IsNull"] = 1] = "IsNull";
    FilterOperator[FilterOperator["GreaterThan"] = 2] = "GreaterThan";
    FilterOperator[FilterOperator["LessThan"] = 3] = "LessThan";
    FilterOperator[FilterOperator["GreaterThanOrEqual"] = 4] = "GreaterThanOrEqual";
    FilterOperator[FilterOperator["LessThanOrEqual"] = 5] = "LessThanOrEqual";
    FilterOperator[FilterOperator["Like"] = 6] = "Like";
    FilterOperator[FilterOperator["Not"] = 7] = "Not";
    FilterOperator[FilterOperator["Between"] = 8] = "Between";
    FilterOperator[FilterOperator["InList"] = 9] = "InList";
    FilterOperator[FilterOperator["And"] = 10] = "And";
    FilterOperator[FilterOperator["Or"] = 11] = "Or";
    FilterOperator[FilterOperator["Cast"] = 12] = "Cast";
    FilterOperator[FilterOperator["InView"] = 13] = "InView";
    FilterOperator[FilterOperator["OfType"] = 14] = "OfType";
    FilterOperator[FilterOperator["RelatedTo"] = 15] = "RelatedTo";
    FilterOperator[FilterOperator["BitwiseAnd"] = 16] = "BitwiseAnd";
    FilterOperator[FilterOperator["BitwiseOr"] = 17] = "BitwiseOr";
})(FilterOperator || (FilterOperator = {}));
export function encodeFilterOperator(data, out) {
    out.setUint32(data);
}
export function decodeFilterOperator(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("FilterOperator", FilterOperator, encodeFilterOperator, decodeFilterOperator, null);
//# sourceMappingURL=FilterOperator.js.map