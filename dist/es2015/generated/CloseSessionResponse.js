import { ResponseHeader } from './ResponseHeader';
/**
Closes a session with the server.
*/
export class CloseSessionResponse {
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
            target = new CloseSessionResponse();
        }
        if (this.responseHeader) {
            target.responseHeader = this.responseHeader.clone();
        }
        return target;
    }
}
export function decodeCloseSessionResponse(inp) {
    let obj = new CloseSessionResponse();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("CloseSessionResponse", CloseSessionResponse, makeExpandedNodeId(476, 0));
//# sourceMappingURL=CloseSessionResponse.js.map