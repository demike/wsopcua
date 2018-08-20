import { ResponseHeader } from './ResponseHeader';
import { decodeApplicationDescription } from './ApplicationDescription';
import * as ec from '../basic-types';
/**
Finds the servers known to the discovery server.
*/
export class FindServersResponse {
    constructor(options) {
        options = options || {};
        this.responseHeader = (options.responseHeader) ? options.responseHeader : new ResponseHeader();
        this.servers = (options.servers) ? options.servers : [];
    }
    encode(out) {
        this.responseHeader.encode(out);
        ec.encodeArray(this.servers, out);
    }
    decode(inp) {
        this.responseHeader.decode(inp);
        this.servers = ec.decodeArray(inp, decodeApplicationDescription);
    }
    clone(target) {
        if (!target) {
            target = new FindServersResponse();
        }
        if (this.responseHeader) {
            target.responseHeader = this.responseHeader.clone();
        }
        if (this.servers) {
            target.servers = ec.cloneComplexArray(this.servers);
        }
        return target;
    }
}
export function decodeFindServersResponse(inp) {
    let obj = new FindServersResponse();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("FindServersResponse", FindServersResponse, makeExpandedNodeId(425, 0));
//# sourceMappingURL=FindServersResponse.js.map