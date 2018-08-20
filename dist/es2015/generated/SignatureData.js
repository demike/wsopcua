import * as ec from '../basic-types';
/**
A digital signature.
*/
export class SignatureData {
    constructor(options) {
        options = options || {};
        this.algorithm = (options.algorithm) ? options.algorithm : null;
        this.signature = (options.signature) ? options.signature : null;
    }
    encode(out) {
        ec.encodeString(this.algorithm, out);
        ec.encodeByteString(this.signature, out);
    }
    decode(inp) {
        this.algorithm = ec.decodeString(inp);
        this.signature = ec.decodeByteString(inp);
    }
    clone(target) {
        if (!target) {
            target = new SignatureData();
        }
        target.algorithm = this.algorithm;
        target.signature = this.signature;
        return target;
    }
}
export function decodeSignatureData(inp) {
    let obj = new SignatureData();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("SignatureData", SignatureData, makeExpandedNodeId(458, 0));
//# sourceMappingURL=SignatureData.js.map