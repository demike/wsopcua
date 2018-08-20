import * as ec from '../basic-types';
import { UserIdentityToken } from './UserIdentityToken';
/**
A token representing a user identified by a user name and password.
*/
export class UserNameIdentityToken extends UserIdentityToken {
    constructor(options) {
        options = options || {};
        super(options);
        this.userName = (options.userName) ? options.userName : null;
        this.password = (options.password) ? options.password : null;
        this.encryptionAlgorithm = (options.encryptionAlgorithm) ? options.encryptionAlgorithm : null;
    }
    encode(out) {
        super.encode(out);
        ec.encodeString(this.userName, out);
        ec.encodeByteString(this.password, out);
        ec.encodeString(this.encryptionAlgorithm, out);
    }
    decode(inp) {
        super.decode(inp);
        this.userName = ec.decodeString(inp);
        this.password = ec.decodeByteString(inp);
        this.encryptionAlgorithm = ec.decodeString(inp);
    }
    clone(target) {
        if (!target) {
            target = new UserNameIdentityToken();
        }
        super.clone(target);
        target.userName = this.userName;
        target.password = this.password;
        target.encryptionAlgorithm = this.encryptionAlgorithm;
        return target;
    }
}
export function decodeUserNameIdentityToken(inp) {
    let obj = new UserNameIdentityToken();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("UserNameIdentityToken", UserNameIdentityToken, makeExpandedNodeId(324, 0));
//# sourceMappingURL=UserNameIdentityToken.js.map