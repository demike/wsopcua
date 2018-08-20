import { RequestHeader } from './RequestHeader';
/**
Closes a secure channel.
*/
export class CloseSecureChannelRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
    }
    encode(out) {
        this.requestHeader.encode(out);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new CloseSecureChannelRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        return target;
    }
}
export function decodeCloseSecureChannelRequest(inp) {
    let obj = new CloseSecureChannelRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("CloseSecureChannelRequest", CloseSecureChannelRequest, makeExpandedNodeId(452, 0));
//# sourceMappingURL=CloseSecureChannelRequest.js.map