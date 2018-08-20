import * as ec from '../basic-types';
import { encodeMessageSecurityMode, decodeMessageSecurityMode } from './MessageSecurityMode';
/**

*/
export class EndpointType {
    constructor(options) {
        options = options || {};
        this.endpointUrl = (options.endpointUrl) ? options.endpointUrl : null;
        this.securityMode = (options.securityMode) ? options.securityMode : null;
        this.securityPolicyUri = (options.securityPolicyUri) ? options.securityPolicyUri : null;
        this.transportProfileUri = (options.transportProfileUri) ? options.transportProfileUri : null;
    }
    encode(out) {
        ec.encodeString(this.endpointUrl, out);
        encodeMessageSecurityMode(this.securityMode, out);
        ec.encodeString(this.securityPolicyUri, out);
        ec.encodeString(this.transportProfileUri, out);
    }
    decode(inp) {
        this.endpointUrl = ec.decodeString(inp);
        this.securityMode = decodeMessageSecurityMode(inp);
        this.securityPolicyUri = ec.decodeString(inp);
        this.transportProfileUri = ec.decodeString(inp);
    }
    clone(target) {
        if (!target) {
            target = new EndpointType();
        }
        target.endpointUrl = this.endpointUrl;
        target.securityMode = this.securityMode;
        target.securityPolicyUri = this.securityPolicyUri;
        target.transportProfileUri = this.transportProfileUri;
        return target;
    }
}
export function decodeEndpointType(inp) {
    let obj = new EndpointType();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("EndpointType", EndpointType, makeExpandedNodeId(15671, 0));
//# sourceMappingURL=EndpointType.js.map