import * as ec from '../basic-types';
import { decodeEndpointUrlListDataType } from './EndpointUrlListDataType';
/**

*/
export class NetworkGroupDataType {
    constructor(options) {
        options = options || {};
        this.serverUri = (options.serverUri) ? options.serverUri : null;
        this.networkPaths = (options.networkPaths) ? options.networkPaths : [];
    }
    encode(out) {
        ec.encodeString(this.serverUri, out);
        ec.encodeArray(this.networkPaths, out);
    }
    decode(inp) {
        this.serverUri = ec.decodeString(inp);
        this.networkPaths = ec.decodeArray(inp, decodeEndpointUrlListDataType);
    }
    clone(target) {
        if (!target) {
            target = new NetworkGroupDataType();
        }
        target.serverUri = this.serverUri;
        if (this.networkPaths) {
            target.networkPaths = ec.cloneComplexArray(this.networkPaths);
        }
        return target;
    }
}
export function decodeNetworkGroupDataType(inp) {
    let obj = new NetworkGroupDataType();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("NetworkGroupDataType", NetworkGroupDataType, makeExpandedNodeId(11958, 0));
//# sourceMappingURL=NetworkGroupDataType.js.map