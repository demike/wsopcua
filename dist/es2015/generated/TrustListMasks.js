export var TrustListMasks;
(function (TrustListMasks) {
    TrustListMasks[TrustListMasks["None"] = 0] = "None";
    TrustListMasks[TrustListMasks["TrustedCertificates"] = 1] = "TrustedCertificates";
    TrustListMasks[TrustListMasks["TrustedCrls"] = 2] = "TrustedCrls";
    TrustListMasks[TrustListMasks["IssuerCertificates"] = 4] = "IssuerCertificates";
    TrustListMasks[TrustListMasks["IssuerCrls"] = 8] = "IssuerCrls";
    TrustListMasks[TrustListMasks["All"] = 15] = "All";
})(TrustListMasks || (TrustListMasks = {}));
export function encodeTrustListMasks(data, out) {
    out.setUint32(data);
}
export function decodeTrustListMasks(inp) {
    return inp.getUint32();
}
import { registerEnumeration } from "../factory/factories_enumerations";
registerEnumeration("TrustListMasks", TrustListMasks, encodeTrustListMasks, decodeTrustListMasks, null);
//# sourceMappingURL=TrustListMasks.js.map