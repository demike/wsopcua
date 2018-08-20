import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
import { decodeServerOnNetwork } from './ServerOnNetwork';
/**

*/
export class FindServersOnNetworkResponse {
    constructor(options) {
        options = options || {};
        this.responseHeader = (options.responseHeader) ? options.responseHeader : new ResponseHeader();
        this.lastCounterResetTime = (options.lastCounterResetTime) ? options.lastCounterResetTime : null;
        this.servers = (options.servers) ? options.servers : [];
    }
    encode(out) {
        this.responseHeader.encode(out);
        ec.encodeDateTime(this.lastCounterResetTime, out);
        ec.encodeArray(this.servers, out);
    }
    decode(inp) {
        this.responseHeader.decode(inp);
        this.lastCounterResetTime = ec.decodeDateTime(inp);
        this.servers = ec.decodeArray(inp, decodeServerOnNetwork);
    }
    clone(target) {
        if (!target) {
            target = new FindServersOnNetworkResponse();
        }
        if (this.responseHeader) {
            target.responseHeader = this.responseHeader.clone();
        }
        target.lastCounterResetTime = this.lastCounterResetTime;
        if (this.servers) {
            target.servers = ec.cloneComplexArray(this.servers);
        }
        return target;
    }
}
export function decodeFindServersOnNetworkResponse(inp) {
    let obj = new FindServersOnNetworkResponse();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("FindServersOnNetworkResponse", FindServersOnNetworkResponse, makeExpandedNodeId(12209, 0));
//# sourceMappingURL=FindServersOnNetworkResponse.js.map