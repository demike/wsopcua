import * as ec from '../basic-types';
import { UserIdentityToken } from './UserIdentityToken';
/**
A token representing a user identified by a WS-Security XML token.
*/
export class IssuedIdentityToken extends UserIdentityToken {
    constructor(options) {
        options = options || {};
        super(options);
        this.tokenData = (options.tokenData) ? options.tokenData : null;
        this.encryptionAlgorithm = (options.encryptionAlgorithm) ? options.encryptionAlgorithm : null;
    }
    encode(out) {
        super.encode(out);
        ec.encodeByteString(this.tokenData, out);
        ec.encodeString(this.encryptionAlgorithm, out);
    }
    decode(inp) {
        super.decode(inp);
        this.tokenData = ec.decodeByteString(inp);
        this.encryptionAlgorithm = ec.decodeString(inp);
    }
    clone(target) {
        if (!target) {
            target = new IssuedIdentityToken();
        }
        super.clone(target);
        target.tokenData = this.tokenData;
        target.encryptionAlgorithm = this.encryptionAlgorithm;
        return target;
    }
}
export function decodeIssuedIdentityToken(inp) {
    let obj = new IssuedIdentityToken();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("IssuedIdentityToken", IssuedIdentityToken, makeExpandedNodeId(940, 0));
//# sourceMappingURL=IssuedIdentityToken.js.map