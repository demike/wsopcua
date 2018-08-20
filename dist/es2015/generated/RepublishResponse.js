import { ResponseHeader } from './ResponseHeader';
import { NotificationMessage } from './NotificationMessage';
/**

*/
export class RepublishResponse {
    constructor(options) {
        options = options || {};
        this.responseHeader = (options.responseHeader) ? options.responseHeader : new ResponseHeader();
        this.notificationMessage = (options.notificationMessage) ? options.notificationMessage : new NotificationMessage();
    }
    encode(out) {
        this.responseHeader.encode(out);
        this.notificationMessage.encode(out);
    }
    decode(inp) {
        this.responseHeader.decode(inp);
        this.notificationMessage.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new RepublishResponse();
        }
        if (this.responseHeader) {
            target.responseHeader = this.responseHeader.clone();
        }
        if (this.notificationMessage) {
            target.notificationMessage = this.notificationMessage.clone();
        }
        return target;
    }
}
export function decodeRepublishResponse(inp) {
    let obj = new RepublishResponse();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("RepublishResponse", RepublishResponse, makeExpandedNodeId(835, 0));
//# sourceMappingURL=RepublishResponse.js.map