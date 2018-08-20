import * as ec from '../basic-types';
/**

*/
export class ServerOnNetwork {
    constructor(options) {
        options = options || {};
        this.recordId = (options.recordId) ? options.recordId : null;
        this.serverName = (options.serverName) ? options.serverName : null;
        this.discoveryUrl = (options.discoveryUrl) ? options.discoveryUrl : null;
        this.serverCapabilities = (options.serverCapabilities) ? options.serverCapabilities : [];
    }
    encode(out) {
        ec.encodeUInt32(this.recordId, out);
        ec.encodeString(this.serverName, out);
        ec.encodeString(this.discoveryUrl, out);
        ec.encodeArray(this.serverCapabilities, out, ec.encodeString);
    }
    decode(inp) {
        this.recordId = ec.decodeUInt32(inp);
        this.serverName = ec.decodeString(inp);
        this.discoveryUrl = ec.decodeString(inp);
        this.serverCapabilities = ec.decodeArray(inp, ec.decodeString);
    }
    clone(target) {
        if (!target) {
            target = new ServerOnNetwork();
        }
        target.recordId = this.recordId;
        target.serverName = this.serverName;
        target.discoveryUrl = this.discoveryUrl;
        target.serverCapabilities = ec.cloneArray(this.serverCapabilities);
        return target;
    }
}
export function decodeServerOnNetwork(inp) {
    let obj = new ServerOnNetwork();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ServerOnNetwork", ServerOnNetwork, makeExpandedNodeId(12207, 0));
//# sourceMappingURL=ServerOnNetwork.js.map