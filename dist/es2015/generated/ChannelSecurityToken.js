import * as ec from '../basic-types';
/**
The token that identifies a set of keys for an active secure channel.
*/
export class ChannelSecurityToken {
    constructor(options) {
        options = options || {};
        this.channelId = (options.channelId) ? options.channelId : null;
        this.tokenId = (options.tokenId) ? options.tokenId : null;
        this.createdAt = (options.createdAt) ? options.createdAt : null;
        this.revisedLifetime = (options.revisedLifetime) ? options.revisedLifetime : null;
    }
    encode(out) {
        ec.encodeUInt32(this.channelId, out);
        ec.encodeUInt32(this.tokenId, out);
        ec.encodeDateTime(this.createdAt, out);
        ec.encodeUInt32(this.revisedLifetime, out);
    }
    decode(inp) {
        this.channelId = ec.decodeUInt32(inp);
        this.tokenId = ec.decodeUInt32(inp);
        this.createdAt = ec.decodeDateTime(inp);
        this.revisedLifetime = ec.decodeUInt32(inp);
    }
    clone(target) {
        if (!target) {
            target = new ChannelSecurityToken();
        }
        target.channelId = this.channelId;
        target.tokenId = this.tokenId;
        target.createdAt = this.createdAt;
        target.revisedLifetime = this.revisedLifetime;
        return target;
    }
}
export function decodeChannelSecurityToken(inp) {
    let obj = new ChannelSecurityToken();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ChannelSecurityToken", ChannelSecurityToken, makeExpandedNodeId(443, 0));
//# sourceMappingURL=ChannelSecurityToken.js.map