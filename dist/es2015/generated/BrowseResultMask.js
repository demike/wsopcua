/**
A bit mask which specifies what should be returned in a browse response.*/
export var BrowseResultMask;
(function (BrowseResultMask) {
    BrowseResultMask[BrowseResultMask["None"] = 0] = "None";
    BrowseResultMask[BrowseResultMask["ReferenceTypeId"] = 1] = "ReferenceTypeId";
    BrowseResultMask[BrowseResultMask["IsForward"] = 2] = "IsForward";
    BrowseResultMask[BrowseResultMask["NodeClass"] = 4] = "NodeClass";
    BrowseResultMask[BrowseResultMask["BrowseName"] = 8] = "BrowseName";
    BrowseResultMask[BrowseResultMask["DisplayName"] = 16] = "DisplayName";
    BrowseResultMask[BrowseResultMask["TypeDefinition"] = 32] = "TypeDefinition";
    BrowseResultMask[BrowseResultMask["All"] = 63] = "All";
    BrowseResultMask[BrowseResultMask["ReferenceTypeInfo"] = 3] = "ReferenceTypeInfo";
    BrowseResultMask[BrowseResultMask["TargetInfo"] = 60] = "TargetInfo";
})(BrowseResultMask || (BrowseResultMask = {}));
export function encodeBrowseResultMask(data, out) {
    out.setUint32(data);
}
export function decodeBrowseResultMask(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("BrowseResultMask", BrowseResultMask, encodeBrowseResultMask, decodeBrowseResultMask, null);
//# sourceMappingURL=BrowseResultMask.js.map