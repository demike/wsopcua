import * as ec from '../basic-types';
import { encodeMessageSecurityMode, decodeMessageSecurityMode } from './MessageSecurityMode';
/**

*/
export class SessionSecurityDiagnosticsDataType {
    constructor(options) {
        options = options || {};
        this.sessionId = (options.sessionId) ? options.sessionId : null;
        this.clientUserIdOfSession = (options.clientUserIdOfSession) ? options.clientUserIdOfSession : null;
        this.clientUserIdHistory = (options.clientUserIdHistory) ? options.clientUserIdHistory : [];
        this.authenticationMechanism = (options.authenticationMechanism) ? options.authenticationMechanism : null;
        this.encoding = (options.encoding) ? options.encoding : null;
        this.transportProtocol = (options.transportProtocol) ? options.transportProtocol : null;
        this.securityMode = (options.securityMode) ? options.securityMode : null;
        this.securityPolicyUri = (options.securityPolicyUri) ? options.securityPolicyUri : null;
        this.clientCertificate = (options.clientCertificate) ? options.clientCertificate : null;
    }
    encode(out) {
        ec.encodeNodeId(this.sessionId, out);
        ec.encodeString(this.clientUserIdOfSession, out);
        ec.encodeArray(this.clientUserIdHistory, out, ec.encodeString);
        ec.encodeString(this.authenticationMechanism, out);
        ec.encodeString(this.encoding, out);
        ec.encodeString(this.transportProtocol, out);
        encodeMessageSecurityMode(this.securityMode, out);
        ec.encodeString(this.securityPolicyUri, out);
        ec.encodeByteString(this.clientCertificate, out);
    }
    decode(inp) {
        this.sessionId = ec.decodeNodeId(inp);
        this.clientUserIdOfSession = ec.decodeString(inp);
        this.clientUserIdHistory = ec.decodeArray(inp, ec.decodeString);
        this.authenticationMechanism = ec.decodeString(inp);
        this.encoding = ec.decodeString(inp);
        this.transportProtocol = ec.decodeString(inp);
        this.securityMode = decodeMessageSecurityMode(inp);
        this.securityPolicyUri = ec.decodeString(inp);
        this.clientCertificate = ec.decodeByteString(inp);
    }
    clone(target) {
        if (!target) {
            target = new SessionSecurityDiagnosticsDataType();
        }
        target.sessionId = this.sessionId;
        target.clientUserIdOfSession = this.clientUserIdOfSession;
        target.clientUserIdHistory = ec.cloneArray(this.clientUserIdHistory);
        target.authenticationMechanism = this.authenticationMechanism;
        target.encoding = this.encoding;
        target.transportProtocol = this.transportProtocol;
        target.securityMode = this.securityMode;
        target.securityPolicyUri = this.securityPolicyUri;
        target.clientCertificate = this.clientCertificate;
        return target;
    }
}
export function decodeSessionSecurityDiagnosticsDataType(inp) {
    let obj = new SessionSecurityDiagnosticsDataType();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("SessionSecurityDiagnosticsDataType", SessionSecurityDiagnosticsDataType, makeExpandedNodeId(870, 0));
//# sourceMappingURL=SessionSecurityDiagnosticsDataType.js.map