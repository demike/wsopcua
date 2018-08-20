import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
import { encodeSecurityTokenRequestType, decodeSecurityTokenRequestType } from './SecurityTokenRequestType';
import { encodeMessageSecurityMode, decodeMessageSecurityMode } from './MessageSecurityMode';
/**
Creates a secure channel with a server.
*/
export class OpenSecureChannelRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.clientProtocolVersion = (options.clientProtocolVersion) ? options.clientProtocolVersion : null;
        this.requestType = (options.requestType) ? options.requestType : null;
        this.securityMode = (options.securityMode) ? options.securityMode : null;
        this.clientNonce = (options.clientNonce) ? options.clientNonce : null;
        this.requestedLifetime = (options.requestedLifetime) ? options.requestedLifetime : null;
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeUInt32(this.clientProtocolVersion, out);
        encodeSecurityTokenRequestType(this.requestType, out);
        encodeMessageSecurityMode(this.securityMode, out);
        ec.encodeByteString(this.clientNonce, out);
        ec.encodeUInt32(this.requestedLifetime, out);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.clientProtocolVersion = ec.decodeUInt32(inp);
        this.requestType = decodeSecurityTokenRequestType(inp);
        this.securityMode = decodeMessageSecurityMode(inp);
        this.clientNonce = ec.decodeByteString(inp);
        this.requestedLifetime = ec.decodeUInt32(inp);
    }
    clone(target) {
        if (!target) {
            target = new OpenSecureChannelRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        target.clientProtocolVersion = this.clientProtocolVersion;
        target.requestType = this.requestType;
        target.securityMode = this.securityMode;
        target.clientNonce = this.clientNonce;
        target.requestedLifetime = this.requestedLifetime;
        return target;
    }
}
export function decodeOpenSecureChannelRequest(inp) {
    let obj = new OpenSecureChannelRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("OpenSecureChannelRequest", OpenSecureChannelRequest, makeExpandedNodeId(446, 0));
//# sourceMappingURL=OpenSecureChannelRequest.js.map