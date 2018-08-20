import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
/**
Cancels an outstanding request.
*/
export class CancelRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.requestHandle = (options.requestHandle) ? options.requestHandle : null;
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeUInt32(this.requestHandle, out);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.requestHandle = ec.decodeUInt32(inp);
    }
    clone(target) {
        if (!target) {
            target = new CancelRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        target.requestHandle = this.requestHandle;
        return target;
    }
}
export function decodeCancelRequest(inp) {
    let obj = new CancelRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("CancelRequest", CancelRequest, makeExpandedNodeId(479, 0));
//# sourceMappingURL=CancelRequest.js.map