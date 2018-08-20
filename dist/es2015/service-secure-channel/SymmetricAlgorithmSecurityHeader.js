import * as ec from '../basic-types';
"use strict";
// Symmetric algorithms are used to secure all messages other than the OpenSecureChannel messages
// OPC UA Secure Conversation Message Header Release 1.02 Part 6 page 39
export class SymmetricAlgorithmSecurityHeader {
    constructor(options) {
        options = options || {};
        this.tokenId = options.tokenId || 0xDEADBEEF;
    }
    encode(out) {
        ec.encodeUInt32(this.tokenId, out);
    }
    decode(inp) {
        this.tokenId = ec.decodeUInt32(inp);
    }
    clone(target) {
        if (!target) {
            target = new SymmetricAlgorithmSecurityHeader();
        }
        target.tokenId = this.tokenId;
        return target;
    }
}
;
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
import { generate_new_id } from '../factory';
register_class_definition("SymmetricAlgorithmSecurityHeader", SymmetricAlgorithmSecurityHeader, makeExpandedNodeId(generate_new_id()));
//# sourceMappingURL=SymmetricAlgorithmSecurityHeader.js.map