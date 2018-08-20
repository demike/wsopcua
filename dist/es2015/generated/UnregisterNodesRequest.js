import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
/**
Unregisters one or more previously registered nodes.
*/
export class UnregisterNodesRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.nodesToUnregister = (options.nodesToUnregister) ? options.nodesToUnregister : [];
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeArray(this.nodesToUnregister, out, ec.encodeNodeId);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.nodesToUnregister = ec.decodeArray(inp, ec.decodeNodeId);
    }
    clone(target) {
        if (!target) {
            target = new UnregisterNodesRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        target.nodesToUnregister = ec.cloneArray(this.nodesToUnregister);
        return target;
    }
}
export function decodeUnregisterNodesRequest(inp) {
    let obj = new UnregisterNodesRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("UnregisterNodesRequest", UnregisterNodesRequest, makeExpandedNodeId(566, 0));
//# sourceMappingURL=UnregisterNodesRequest.js.map