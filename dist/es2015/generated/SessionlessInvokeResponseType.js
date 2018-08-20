import * as ec from '../basic-types';
/**

*/
export class SessionlessInvokeResponseType {
    constructor(options) {
        options = options || {};
        this.namespaceUris = (options.namespaceUris) ? options.namespaceUris : [];
        this.serverUris = (options.serverUris) ? options.serverUris : [];
        this.serviceId = (options.serviceId) ? options.serviceId : null;
    }
    encode(out) {
        ec.encodeArray(this.namespaceUris, out, ec.encodeString);
        ec.encodeArray(this.serverUris, out, ec.encodeString);
        ec.encodeUInt32(this.serviceId, out);
    }
    decode(inp) {
        this.namespaceUris = ec.decodeArray(inp, ec.decodeString);
        this.serverUris = ec.decodeArray(inp, ec.decodeString);
        this.serviceId = ec.decodeUInt32(inp);
    }
    clone(target) {
        if (!target) {
            target = new SessionlessInvokeResponseType();
        }
        target.namespaceUris = ec.cloneArray(this.namespaceUris);
        target.serverUris = ec.cloneArray(this.serverUris);
        target.serviceId = this.serviceId;
        return target;
    }
}
export function decodeSessionlessInvokeResponseType(inp) {
    let obj = new SessionlessInvokeResponseType();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("SessionlessInvokeResponseType", SessionlessInvokeResponseType, makeExpandedNodeId(21001, 0));
//# sourceMappingURL=SessionlessInvokeResponseType.js.map