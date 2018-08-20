import * as ec from '../basic-types';
/**

*/
export class SessionlessInvokeRequestType {
    constructor(options) {
        options = options || {};
        this.urisVersion = (options.urisVersion) ? options.urisVersion : [];
        this.namespaceUris = (options.namespaceUris) ? options.namespaceUris : [];
        this.serverUris = (options.serverUris) ? options.serverUris : [];
        this.localeIds = (options.localeIds) ? options.localeIds : [];
        this.serviceId = (options.serviceId) ? options.serviceId : null;
    }
    encode(out) {
        ec.encodeArray(this.urisVersion, out, ec.encodeUInt32);
        ec.encodeArray(this.namespaceUris, out, ec.encodeString);
        ec.encodeArray(this.serverUris, out, ec.encodeString);
        ec.encodeArray(this.localeIds, out, ec.encodeString);
        ec.encodeUInt32(this.serviceId, out);
    }
    decode(inp) {
        this.urisVersion = ec.decodeArray(inp, ec.decodeUInt32);
        this.namespaceUris = ec.decodeArray(inp, ec.decodeString);
        this.serverUris = ec.decodeArray(inp, ec.decodeString);
        this.localeIds = ec.decodeArray(inp, ec.decodeString);
        this.serviceId = ec.decodeUInt32(inp);
    }
    clone(target) {
        if (!target) {
            target = new SessionlessInvokeRequestType();
        }
        target.urisVersion = ec.cloneArray(this.urisVersion);
        target.namespaceUris = ec.cloneArray(this.namespaceUris);
        target.serverUris = ec.cloneArray(this.serverUris);
        target.localeIds = ec.cloneArray(this.localeIds);
        target.serviceId = this.serviceId;
        return target;
    }
}
export function decodeSessionlessInvokeRequestType(inp) {
    let obj = new SessionlessInvokeRequestType();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("SessionlessInvokeRequestType", SessionlessInvokeRequestType, makeExpandedNodeId(15903, 0));
//# sourceMappingURL=SessionlessInvokeRequestType.js.map