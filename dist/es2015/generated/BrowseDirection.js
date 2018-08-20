/**
The directions of the references to return.*/
export var BrowseDirection;
(function (BrowseDirection) {
    BrowseDirection[BrowseDirection["Forward"] = 0] = "Forward";
    BrowseDirection[BrowseDirection["Inverse"] = 1] = "Inverse";
    BrowseDirection[BrowseDirection["Both"] = 2] = "Both";
    BrowseDirection[BrowseDirection["Invalid"] = 3] = "Invalid";
})(BrowseDirection || (BrowseDirection = {}));
export function encodeBrowseDirection(data, out) {
    out.setUint32(data);
}
export function decodeBrowseDirection(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("BrowseDirection", BrowseDirection, encodeBrowseDirection, decodeBrowseDirection, null);
//# sourceMappingURL=BrowseDirection.js.map