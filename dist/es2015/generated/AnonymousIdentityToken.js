import { UserIdentityToken } from './UserIdentityToken';
/**
A token representing an anonymous user.
*/
export class AnonymousIdentityToken extends UserIdentityToken {
    constructor(options) {
        options = options || {};
        super(options);
    }
    encode(out) {
        super.encode(out);
    }
    decode(inp) {
        super.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new AnonymousIdentityToken();
        }
        super.clone(target);
        return target;
    }
}
export function decodeAnonymousIdentityToken(inp) {
    let obj = new AnonymousIdentityToken();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("AnonymousIdentityToken", AnonymousIdentityToken, makeExpandedNodeId(321, 0));
//# sourceMappingURL=AnonymousIdentityToken.js.map