import { ResponseHeader } from './ResponseHeader';
/**
Unregisters one or more previously registered nodes.
*/
export class UnregisterNodesResponse {
    constructor(options) {
        options = options || {};
        this.responseHeader = (options.responseHeader) ? options.responseHeader : new ResponseHeader();
    }
    encode(out) {
        this.responseHeader.encode(out);
    }
    decode(inp) {
        this.responseHeader.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new UnregisterNodesResponse();
        }
        if (this.responseHeader) {
            target.responseHeader = this.responseHeader.clone();
        }
        return target;
    }
}
export function decodeUnregisterNodesResponse(inp) {
    let obj = new UnregisterNodesResponse();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("UnregisterNodesResponse", UnregisterNodesResponse, makeExpandedNodeId(569, 0));
//# sourceMappingURL=UnregisterNodesResponse.js.map