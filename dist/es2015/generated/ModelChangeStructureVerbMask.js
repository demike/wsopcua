export var ModelChangeStructureVerbMask;
(function (ModelChangeStructureVerbMask) {
    ModelChangeStructureVerbMask[ModelChangeStructureVerbMask["NodeAdded"] = 1] = "NodeAdded";
    ModelChangeStructureVerbMask[ModelChangeStructureVerbMask["NodeDeleted"] = 2] = "NodeDeleted";
    ModelChangeStructureVerbMask[ModelChangeStructureVerbMask["ReferenceAdded"] = 4] = "ReferenceAdded";
    ModelChangeStructureVerbMask[ModelChangeStructureVerbMask["ReferenceDeleted"] = 8] = "ReferenceDeleted";
    ModelChangeStructureVerbMask[ModelChangeStructureVerbMask["DataTypeChanged"] = 16] = "DataTypeChanged";
})(ModelChangeStructureVerbMask || (ModelChangeStructureVerbMask = {}));
export function encodeModelChangeStructureVerbMask(data, out) {
    out.setUint32(data);
}
export function decodeModelChangeStructureVerbMask(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("ModelChangeStructureVerbMask", ModelChangeStructureVerbMask, encodeModelChangeStructureVerbMask, decodeModelChangeStructureVerbMask, null);
//# sourceMappingURL=ModelChangeStructureVerbMask.js.map