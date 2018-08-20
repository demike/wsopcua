import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
/**
Cancels an outstanding request.
*/
export class CancelResponse {
    constructor(options) {
        options = options || {};
        this.responseHeader = (options.responseHeader) ? options.responseHeader : new ResponseHeader();
        this.cancelCount = (options.cancelCount) ? options.cancelCount : null;
    }
    encode(out) {
        this.responseHeader.encode(out);
        ec.encodeUInt32(this.cancelCount, out);
    }
    decode(inp) {
        this.responseHeader.decode(inp);
        this.cancelCount = ec.decodeUInt32(inp);
    }
    clone(target) {
        if (!target) {
            target = new CancelResponse();
        }
        if (this.responseHeader) {
            target.responseHeader = this.responseHeader.clone();
        }
        target.cancelCount = this.cancelCount;
        return target;
    }
}
export function decodeCancelResponse(inp) {
    let obj = new CancelResponse();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("CancelResponse", CancelResponse, makeExpandedNodeId(482, 0));
//# sourceMappingURL=CancelResponse.js.map