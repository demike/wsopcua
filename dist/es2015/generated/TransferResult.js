import * as ec from '../basic-types';
/**

*/
export class TransferResult {
    constructor(options) {
        options = options || {};
        this.statusCode = (options.statusCode) ? options.statusCode : null;
        this.availableSequenceNumbers = (options.availableSequenceNumbers) ? options.availableSequenceNumbers : [];
    }
    encode(out) {
        ec.encodeStatusCode(this.statusCode, out);
        ec.encodeArray(this.availableSequenceNumbers, out, ec.encodeUInt32);
    }
    decode(inp) {
        this.statusCode = ec.decodeStatusCode(inp);
        this.availableSequenceNumbers = ec.decodeArray(inp, ec.decodeUInt32);
    }
    clone(target) {
        if (!target) {
            target = new TransferResult();
        }
        target.statusCode = this.statusCode;
        target.availableSequenceNumbers = ec.cloneArray(this.availableSequenceNumbers);
        return target;
    }
}
export function decodeTransferResult(inp) {
    let obj = new TransferResult();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("TransferResult", TransferResult, makeExpandedNodeId(838, 0));
//# sourceMappingURL=TransferResult.js.map