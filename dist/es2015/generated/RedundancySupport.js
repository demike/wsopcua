export var RedundancySupport;
(function (RedundancySupport) {
    RedundancySupport[RedundancySupport["None"] = 0] = "None";
    RedundancySupport[RedundancySupport["Cold"] = 1] = "Cold";
    RedundancySupport[RedundancySupport["Warm"] = 2] = "Warm";
    RedundancySupport[RedundancySupport["Hot"] = 3] = "Hot";
    RedundancySupport[RedundancySupport["Transparent"] = 4] = "Transparent";
    RedundancySupport[RedundancySupport["HotAndMirrored"] = 5] = "HotAndMirrored";
})(RedundancySupport || (RedundancySupport = {}));
export function encodeRedundancySupport(data, out) {
    out.setUint32(data);
}
export function decodeRedundancySupport(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("RedundancySupport", RedundancySupport, encodeRedundancySupport, decodeRedundancySupport, null);
//# sourceMappingURL=RedundancySupport.js.map