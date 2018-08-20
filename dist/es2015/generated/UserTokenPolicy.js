import * as ec from '../basic-types';
import { encodeUserTokenType, decodeUserTokenType } from './UserTokenType';
/**
Describes a user token that can be used with a server.
*/
export class UserTokenPolicy {
    constructor(options) {
        options = options || {};
        this.policyId = (options.policyId) ? options.policyId : null;
        this.tokenType = (options.tokenType) ? options.tokenType : null;
        this.issuedTokenType = (options.issuedTokenType) ? options.issuedTokenType : null;
        this.issuerEndpointUrl = (options.issuerEndpointUrl) ? options.issuerEndpointUrl : null;
        this.securityPolicyUri = (options.securityPolicyUri) ? options.securityPolicyUri : null;
    }
    encode(out) {
        ec.encodeString(this.policyId, out);
        encodeUserTokenType(this.tokenType, out);
        ec.encodeString(this.issuedTokenType, out);
        ec.encodeString(this.issuerEndpointUrl, out);
        ec.encodeString(this.securityPolicyUri, out);
    }
    decode(inp) {
        this.policyId = ec.decodeString(inp);
        this.tokenType = decodeUserTokenType(inp);
        this.issuedTokenType = ec.decodeString(inp);
        this.issuerEndpointUrl = ec.decodeString(inp);
        this.securityPolicyUri = ec.decodeString(inp);
    }
    clone(target) {
        if (!target) {
            target = new UserTokenPolicy();
        }
        target.policyId = this.policyId;
        target.tokenType = this.tokenType;
        target.issuedTokenType = this.issuedTokenType;
        target.issuerEndpointUrl = this.issuerEndpointUrl;
        target.securityPolicyUri = this.securityPolicyUri;
        return target;
    }
}
export function decodeUserTokenPolicy(inp) {
    let obj = new UserTokenPolicy();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("UserTokenPolicy", UserTokenPolicy, makeExpandedNodeId(306, 0));
//# sourceMappingURL=UserTokenPolicy.js.map