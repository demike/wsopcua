import { RequestHeader } from './RequestHeader';
import { RegisteredServer } from './RegisteredServer';
/**
Registers a server with the discovery server.
*/
export class RegisterServerRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.server = (options.server) ? options.server : new RegisteredServer();
    }
    encode(out) {
        this.requestHeader.encode(out);
        this.server.encode(out);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.server.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new RegisterServerRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        if (this.server) {
            target.server = this.server.clone();
        }
        return target;
    }
}
export function decodeRegisterServerRequest(inp) {
    let obj = new RegisterServerRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("RegisterServerRequest", RegisterServerRequest, makeExpandedNodeId(437, 0));
//# sourceMappingURL=RegisterServerRequest.js.map