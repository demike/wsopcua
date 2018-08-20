import { ResponseHeader } from './ResponseHeader';
/**
Registers a server with the discovery server.
*/
export class RegisterServerResponse {
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
            target = new RegisterServerResponse();
        }
        if (this.responseHeader) {
            target.responseHeader = this.responseHeader.clone();
        }
        return target;
    }
}
export function decodeRegisterServerResponse(inp) {
    let obj = new RegisterServerResponse();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("RegisterServerResponse", RegisterServerResponse, makeExpandedNodeId(440, 0));
//# sourceMappingURL=RegisterServerResponse.js.map