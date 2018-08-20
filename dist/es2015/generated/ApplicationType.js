/**
The types of applications.*/
export var ApplicationType;
(function (ApplicationType) {
    ApplicationType[ApplicationType["Server"] = 0] = "Server";
    ApplicationType[ApplicationType["Client"] = 1] = "Client";
    ApplicationType[ApplicationType["ClientAndServer"] = 2] = "ClientAndServer";
    ApplicationType[ApplicationType["DiscoveryServer"] = 3] = "DiscoveryServer";
})(ApplicationType || (ApplicationType = {}));
export function encodeApplicationType(data, out) {
    out.setUint32(data);
}
export function decodeApplicationType(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("ApplicationType", ApplicationType, encodeApplicationType, decodeApplicationType, null);
//# sourceMappingURL=ApplicationType.js.map