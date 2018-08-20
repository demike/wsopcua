import * as ec from '../basic-types';
import { encodeServerState, decodeServerState } from './ServerState';
/**

*/
export class RedundantServerDataType {
    constructor(options) {
        options = options || {};
        this.serverId = (options.serverId) ? options.serverId : null;
        this.serviceLevel = (options.serviceLevel) ? options.serviceLevel : null;
        this.serverState = (options.serverState) ? options.serverState : null;
    }
    encode(out) {
        ec.encodeString(this.serverId, out);
        ec.encodeByte(this.serviceLevel, out);
        encodeServerState(this.serverState, out);
    }
    decode(inp) {
        this.serverId = ec.decodeString(inp);
        this.serviceLevel = ec.decodeByte(inp);
        this.serverState = decodeServerState(inp);
    }
    clone(target) {
        if (!target) {
            target = new RedundantServerDataType();
        }
        target.serverId = this.serverId;
        target.serviceLevel = this.serviceLevel;
        target.serverState = this.serverState;
        return target;
    }
}
export function decodeRedundantServerDataType(inp) {
    let obj = new RedundantServerDataType();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("RedundantServerDataType", RedundantServerDataType, makeExpandedNodeId(855, 0));
//# sourceMappingURL=RedundantServerDataType.js.map