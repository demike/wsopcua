"use strict";
import * as ec from '../basic-types';
//Asymmetric algorithms are used to secure the OpenSecureChannel messages.
export class AsymmetricAlgorithmSecurityHeader {
    constructor(options) {
        options = options || {};
        this.securityPolicyUri = options.securityPolicyUri;
        this.senderCertificate = options.senderCertificate;
        this.receiverCertificateThumbprint = options.receiverCertificateThumbprint;
    }
    encode(out) {
        ec.encodeString(this.securityPolicyUri, out);
        ec.encodeByteString(this.senderCertificate, out);
        ec.encodeByteString(this.receiverCertificateThumbprint, out);
    }
    decode(inp) {
        this.securityPolicyUri = ec.decodeString(inp);
        this.senderCertificate = ec.decodeByteString(inp);
        this.receiverCertificateThumbprint = ec.decodeByteString(inp);
    }
    clone(target) {
        if (!target) {
            target = new AsymmetricAlgorithmSecurityHeader();
        }
        target.securityPolicyUri = this.securityPolicyUri;
        target.senderCertificate = this.senderCertificate; //TODO: deep copy?
        target.receiverCertificateThumbprint = this.receiverCertificateThumbprint;
        return target;
    }
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
import { generate_new_id } from '../factory';
register_class_definition("AsymmetricAlgorithmSecurityHeader", AsymmetricAlgorithmSecurityHeader, makeExpandedNodeId(generate_new_id()));
//# sourceMappingURL=AsymmetricAlgorithmSecurityHeader.js.map