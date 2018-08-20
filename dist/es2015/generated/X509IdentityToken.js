import * as ec from '../basic-types';
import { UserIdentityToken } from './UserIdentityToken';
/**
A token representing a user identified by an X509 certificate.
*/
export class X509IdentityToken extends UserIdentityToken {
    constructor(options) {
        options = options || {};
        super(options);
        this.certificateData = (options.certificateData) ? options.certificateData : null;
    }
    encode(out) {
        super.encode(out);
        ec.encodeByteString(this.certificateData, out);
    }
    decode(inp) {
        super.decode(inp);
        this.certificateData = ec.decodeByteString(inp);
    }
    clone(target) {
        if (!target) {
            target = new X509IdentityToken();
        }
        super.clone(target);
        target.certificateData = this.certificateData;
        return target;
    }
}
export function decodeX509IdentityToken(inp) {
    let obj = new X509IdentityToken();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("X509IdentityToken", X509IdentityToken, makeExpandedNodeId(327, 0));
//# sourceMappingURL=X509IdentityToken.js.map