import { RequestHeader } from './RequestHeader';
import { ApplicationDescription } from './ApplicationDescription';
import * as ec from '../basic-types';
/**
Creates a new session with the server.
*/
export class CreateSessionRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.clientDescription = (options.clientDescription) ? options.clientDescription : new ApplicationDescription();
        this.serverUri = (options.serverUri) ? options.serverUri : null;
        this.endpointUrl = (options.endpointUrl) ? options.endpointUrl : null;
        this.sessionName = (options.sessionName) ? options.sessionName : null;
        this.clientNonce = (options.clientNonce) ? options.clientNonce : null;
        this.clientCertificate = (options.clientCertificate) ? options.clientCertificate : null;
        this.requestedSessionTimeout = (options.requestedSessionTimeout) ? options.requestedSessionTimeout : null;
        this.maxResponseMessageSize = (options.maxResponseMessageSize) ? options.maxResponseMessageSize : null;
    }
    encode(out) {
        this.requestHeader.encode(out);
        this.clientDescription.encode(out);
        ec.encodeString(this.serverUri, out);
        ec.encodeString(this.endpointUrl, out);
        ec.encodeString(this.sessionName, out);
        ec.encodeByteString(this.clientNonce, out);
        ec.encodeByteString(this.clientCertificate, out);
        ec.encodeDouble(this.requestedSessionTimeout, out);
        ec.encodeUInt32(this.maxResponseMessageSize, out);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.clientDescription.decode(inp);
        this.serverUri = ec.decodeString(inp);
        this.endpointUrl = ec.decodeString(inp);
        this.sessionName = ec.decodeString(inp);
        this.clientNonce = ec.decodeByteString(inp);
        this.clientCertificate = ec.decodeByteString(inp);
        this.requestedSessionTimeout = ec.decodeDouble(inp);
        this.maxResponseMessageSize = ec.decodeUInt32(inp);
    }
    clone(target) {
        if (!target) {
            target = new CreateSessionRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        if (this.clientDescription) {
            target.clientDescription = this.clientDescription.clone();
        }
        target.serverUri = this.serverUri;
        target.endpointUrl = this.endpointUrl;
        target.sessionName = this.sessionName;
        target.clientNonce = this.clientNonce;
        target.clientCertificate = this.clientCertificate;
        target.requestedSessionTimeout = this.requestedSessionTimeout;
        target.maxResponseMessageSize = this.maxResponseMessageSize;
        return target;
    }
}
export function decodeCreateSessionRequest(inp) {
    let obj = new CreateSessionRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("CreateSessionRequest", CreateSessionRequest, makeExpandedNodeId(461, 0));
//# sourceMappingURL=CreateSessionRequest.js.map