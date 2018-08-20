import * as ec from '../basic-types';
import { LocalizedText } from './LocalizedText';
import { encodeApplicationType, decodeApplicationType } from './ApplicationType';
/**
Describes an application and how to find it.
*/
export class ApplicationDescription {
    constructor(options) {
        options = options || {};
        this.applicationUri = (options.applicationUri) ? options.applicationUri : null;
        this.productUri = (options.productUri) ? options.productUri : null;
        this.applicationName = (options.applicationName) ? options.applicationName : new LocalizedText();
        this.applicationType = (options.applicationType) ? options.applicationType : null;
        this.gatewayServerUri = (options.gatewayServerUri) ? options.gatewayServerUri : null;
        this.discoveryProfileUri = (options.discoveryProfileUri) ? options.discoveryProfileUri : null;
        this.discoveryUrls = (options.discoveryUrls) ? options.discoveryUrls : [];
    }
    encode(out) {
        ec.encodeString(this.applicationUri, out);
        ec.encodeString(this.productUri, out);
        this.applicationName.encode(out);
        encodeApplicationType(this.applicationType, out);
        ec.encodeString(this.gatewayServerUri, out);
        ec.encodeString(this.discoveryProfileUri, out);
        ec.encodeArray(this.discoveryUrls, out, ec.encodeString);
    }
    decode(inp) {
        this.applicationUri = ec.decodeString(inp);
        this.productUri = ec.decodeString(inp);
        this.applicationName.decode(inp);
        this.applicationType = decodeApplicationType(inp);
        this.gatewayServerUri = ec.decodeString(inp);
        this.discoveryProfileUri = ec.decodeString(inp);
        this.discoveryUrls = ec.decodeArray(inp, ec.decodeString);
    }
    clone(target) {
        if (!target) {
            target = new ApplicationDescription();
        }
        target.applicationUri = this.applicationUri;
        target.productUri = this.productUri;
        if (this.applicationName) {
            target.applicationName = this.applicationName.clone();
        }
        target.applicationType = this.applicationType;
        target.gatewayServerUri = this.gatewayServerUri;
        target.discoveryProfileUri = this.discoveryProfileUri;
        target.discoveryUrls = ec.cloneArray(this.discoveryUrls);
        return target;
    }
}
export function decodeApplicationDescription(inp) {
    let obj = new ApplicationDescription();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ApplicationDescription", ApplicationDescription, makeExpandedNodeId(310, 0));
//# sourceMappingURL=ApplicationDescription.js.map