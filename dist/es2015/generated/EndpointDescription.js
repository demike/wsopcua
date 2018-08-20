import * as ec from '../basic-types';
import { ApplicationDescription } from './ApplicationDescription';
import { encodeMessageSecurityMode, decodeMessageSecurityMode } from './MessageSecurityMode';
import { decodeUserTokenPolicy } from './UserTokenPolicy';
/**
The description of a endpoint that can be used to access a server.
*/
export class EndpointDescription {
    constructor(options) {
        options = options || {};
        this.endpointUrl = (options.endpointUrl) ? options.endpointUrl : null;
        this.server = (options.server) ? options.server : new ApplicationDescription();
        this.serverCertificate = (options.serverCertificate) ? options.serverCertificate : null;
        this.securityMode = (options.securityMode) ? options.securityMode : null;
        this.securityPolicyUri = (options.securityPolicyUri) ? options.securityPolicyUri : null;
        this.userIdentityTokens = (options.userIdentityTokens) ? options.userIdentityTokens : [];
        this.transportProfileUri = (options.transportProfileUri) ? options.transportProfileUri : null;
        this.securityLevel = (options.securityLevel) ? options.securityLevel : null;
    }
    encode(out) {
        ec.encodeString(this.endpointUrl, out);
        this.server.encode(out);
        ec.encodeByteString(this.serverCertificate, out);
        encodeMessageSecurityMode(this.securityMode, out);
        ec.encodeString(this.securityPolicyUri, out);
        ec.encodeArray(this.userIdentityTokens, out);
        ec.encodeString(this.transportProfileUri, out);
        ec.encodeByte(this.securityLevel, out);
    }
    decode(inp) {
        this.endpointUrl = ec.decodeString(inp);
        this.server.decode(inp);
        this.serverCertificate = ec.decodeByteString(inp);
        this.securityMode = decodeMessageSecurityMode(inp);
        this.securityPolicyUri = ec.decodeString(inp);
        this.userIdentityTokens = ec.decodeArray(inp, decodeUserTokenPolicy);
        this.transportProfileUri = ec.decodeString(inp);
        this.securityLevel = ec.decodeByte(inp);
    }
    clone(target) {
        if (!target) {
            target = new EndpointDescription();
        }
        target.endpointUrl = this.endpointUrl;
        if (this.server) {
            target.server = this.server.clone();
        }
        target.serverCertificate = this.serverCertificate;
        target.securityMode = this.securityMode;
        target.securityPolicyUri = this.securityPolicyUri;
        if (this.userIdentityTokens) {
            target.userIdentityTokens = ec.cloneComplexArray(this.userIdentityTokens);
        }
        target.transportProfileUri = this.transportProfileUri;
        target.securityLevel = this.securityLevel;
        return target;
    }
}
export function decodeEndpointDescription(inp) {
    let obj = new EndpointDescription();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("EndpointDescription", EndpointDescription, makeExpandedNodeId(314, 0));
//# sourceMappingURL=EndpointDescription.js.map