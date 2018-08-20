import * as ec from '../basic-types';
/**

*/
export class TrustListDataType {
    constructor(options) {
        options = options || {};
        this.specifiedLists = (options.specifiedLists) ? options.specifiedLists : null;
        this.trustedCertificates = (options.trustedCertificates) ? options.trustedCertificates : [];
        this.trustedCrls = (options.trustedCrls) ? options.trustedCrls : [];
        this.issuerCertificates = (options.issuerCertificates) ? options.issuerCertificates : [];
        this.issuerCrls = (options.issuerCrls) ? options.issuerCrls : [];
    }
    encode(out) {
        ec.encodeUInt32(this.specifiedLists, out);
        ec.encodeArray(this.trustedCertificates, out, ec.encodeByteString);
        ec.encodeArray(this.trustedCrls, out, ec.encodeByteString);
        ec.encodeArray(this.issuerCertificates, out, ec.encodeByteString);
        ec.encodeArray(this.issuerCrls, out, ec.encodeByteString);
    }
    decode(inp) {
        this.specifiedLists = ec.decodeUInt32(inp);
        this.trustedCertificates = ec.decodeArray(inp, ec.decodeByteString);
        this.trustedCrls = ec.decodeArray(inp, ec.decodeByteString);
        this.issuerCertificates = ec.decodeArray(inp, ec.decodeByteString);
        this.issuerCrls = ec.decodeArray(inp, ec.decodeByteString);
    }
    clone(target) {
        if (!target) {
            target = new TrustListDataType();
        }
        target.specifiedLists = this.specifiedLists;
        target.trustedCertificates = ec.cloneArray(this.trustedCertificates);
        target.trustedCrls = ec.cloneArray(this.trustedCrls);
        target.issuerCertificates = ec.cloneArray(this.issuerCertificates);
        target.issuerCrls = ec.cloneArray(this.issuerCrls);
        return target;
    }
}
export function decodeTrustListDataType(inp) {
    let obj = new TrustListDataType();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("TrustListDataType", TrustListDataType, makeExpandedNodeId(12680, 0));
//# sourceMappingURL=TrustListDataType.js.map