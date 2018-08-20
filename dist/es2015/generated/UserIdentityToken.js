import * as ec from '../basic-types';
/**
A base type for a user identity token.
*/
export class UserIdentityToken {
    constructor(options) {
        options = options || {};
        this.policyId = (options.policyId) ? options.policyId : null;
    }
    encode(out) {
        ec.encodeString(this.policyId, out);
    }
    decode(inp) {
        this.policyId = ec.decodeString(inp);
    }
    clone(target) {
        if (!target) {
            target = new UserIdentityToken();
        }
        target.policyId = this.policyId;
        return target;
    }
}
export function decodeUserIdentityToken(inp) {
    let obj = new UserIdentityToken();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("UserIdentityToken", UserIdentityToken, makeExpandedNodeId(318, 0));
//# sourceMappingURL=UserIdentityToken.js.map