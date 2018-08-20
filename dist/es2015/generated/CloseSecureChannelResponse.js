import { ResponseHeader } from './ResponseHeader';
/**
Closes a secure channel.
*/
export class CloseSecureChannelResponse {
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
            target = new CloseSecureChannelResponse();
        }
        if (this.responseHeader) {
            target.responseHeader = this.responseHeader.clone();
        }
        return target;
    }
}
export function decodeCloseSecureChannelResponse(inp) {
    let obj = new CloseSecureChannelResponse();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("CloseSecureChannelResponse", CloseSecureChannelResponse, makeExpandedNodeId(455, 0));
//# sourceMappingURL=CloseSecureChannelResponse.js.map