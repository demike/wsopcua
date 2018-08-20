import { RequestHeader } from './RequestHeader';
import { SignatureData } from './SignatureData';
import { decodeSignedSoftwareCertificate } from './SignedSoftwareCertificate';
import * as ec from '../basic-types';
/**
Activates a session with the server.
*/
export class ActivateSessionRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.clientSignature = (options.clientSignature) ? options.clientSignature : new SignatureData();
        this.clientSoftwareCertificates = (options.clientSoftwareCertificates) ? options.clientSoftwareCertificates : [];
        this.localeIds = (options.localeIds) ? options.localeIds : [];
        this.userIdentityToken = (options.userIdentityToken) ? options.userIdentityToken : null;
        this.userTokenSignature = (options.userTokenSignature) ? options.userTokenSignature : new SignatureData();
    }
    encode(out) {
        this.requestHeader.encode(out);
        this.clientSignature.encode(out);
        ec.encodeArray(this.clientSoftwareCertificates, out);
        ec.encodeArray(this.localeIds, out, ec.encodeString);
        ec.encodeExtensionObject(this.userIdentityToken, out);
        this.userTokenSignature.encode(out);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.clientSignature.decode(inp);
        this.clientSoftwareCertificates = ec.decodeArray(inp, decodeSignedSoftwareCertificate);
        this.localeIds = ec.decodeArray(inp, ec.decodeString);
        this.userIdentityToken = ec.decodeExtensionObject(inp);
        this.userTokenSignature.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new ActivateSessionRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        if (this.clientSignature) {
            target.clientSignature = this.clientSignature.clone();
        }
        if (this.clientSoftwareCertificates) {
            target.clientSoftwareCertificates = ec.cloneComplexArray(this.clientSoftwareCertificates);
        }
        target.localeIds = ec.cloneArray(this.localeIds);
        target.userIdentityToken = this.userIdentityToken;
        if (this.userTokenSignature) {
            target.userTokenSignature = this.userTokenSignature.clone();
        }
        return target;
    }
}
export function decodeActivateSessionRequest(inp) {
    let obj = new ActivateSessionRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ActivateSessionRequest", ActivateSessionRequest, makeExpandedNodeId(467, 0));
//# sourceMappingURL=ActivateSessionRequest.js.map