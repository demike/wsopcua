import * as ec from '../basic-types';
import { encodeServerState, decodeServerState } from './ServerState';
import { BuildInfo } from './BuildInfo';
import { LocalizedText } from './LocalizedText';
/**

*/
export class ServerStatusDataType {
    constructor(options) {
        options = options || {};
        this.startTime = (options.startTime) ? options.startTime : null;
        this.currentTime = (options.currentTime) ? options.currentTime : null;
        this.state = (options.state) ? options.state : null;
        this.buildInfo = (options.buildInfo) ? options.buildInfo : new BuildInfo();
        this.secondsTillShutdown = (options.secondsTillShutdown) ? options.secondsTillShutdown : null;
        this.shutdownReason = (options.shutdownReason) ? options.shutdownReason : new LocalizedText();
    }
    encode(out) {
        ec.encodeDateTime(this.startTime, out);
        ec.encodeDateTime(this.currentTime, out);
        encodeServerState(this.state, out);
        this.buildInfo.encode(out);
        ec.encodeUInt32(this.secondsTillShutdown, out);
        this.shutdownReason.encode(out);
    }
    decode(inp) {
        this.startTime = ec.decodeDateTime(inp);
        this.currentTime = ec.decodeDateTime(inp);
        this.state = decodeServerState(inp);
        this.buildInfo.decode(inp);
        this.secondsTillShutdown = ec.decodeUInt32(inp);
        this.shutdownReason.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new ServerStatusDataType();
        }
        target.startTime = this.startTime;
        target.currentTime = this.currentTime;
        target.state = this.state;
        if (this.buildInfo) {
            target.buildInfo = this.buildInfo.clone();
        }
        target.secondsTillShutdown = this.secondsTillShutdown;
        if (this.shutdownReason) {
            target.shutdownReason = this.shutdownReason.clone();
        }
        return target;
    }
}
export function decodeServerStatusDataType(inp) {
    let obj = new ServerStatusDataType();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ServerStatusDataType", ServerStatusDataType, makeExpandedNodeId(864, 0));
//# sourceMappingURL=ServerStatusDataType.js.map