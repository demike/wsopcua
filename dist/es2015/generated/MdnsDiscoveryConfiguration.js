import * as ec from '../basic-types';
import { DiscoveryConfiguration } from './DiscoveryConfiguration';
/**
The discovery information needed for mDNS registration.
*/
export class MdnsDiscoveryConfiguration extends DiscoveryConfiguration {
    constructor(options) {
        options = options || {};
        super();
        this.mdnsServerName = (options.mdnsServerName) ? options.mdnsServerName : null;
        this.serverCapabilities = (options.serverCapabilities) ? options.serverCapabilities : [];
    }
    encode(out) {
        ec.encodeString(this.mdnsServerName, out);
        ec.encodeArray(this.serverCapabilities, out, ec.encodeString);
    }
    decode(inp) {
        this.mdnsServerName = ec.decodeString(inp);
        this.serverCapabilities = ec.decodeArray(inp, ec.decodeString);
    }
    clone(target) {
        if (!target) {
            target = new MdnsDiscoveryConfiguration();
        }
        target.mdnsServerName = this.mdnsServerName;
        target.serverCapabilities = ec.cloneArray(this.serverCapabilities);
        return target;
    }
}
export function decodeMdnsDiscoveryConfiguration(inp) {
    let obj = new MdnsDiscoveryConfiguration();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("MdnsDiscoveryConfiguration", MdnsDiscoveryConfiguration, makeExpandedNodeId(12901, 0));
//# sourceMappingURL=MdnsDiscoveryConfiguration.js.map