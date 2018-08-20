import { RequestHeader } from './RequestHeader';
import { decodeAddNodesItem } from './AddNodesItem';
import * as ec from '../basic-types';
/**
Adds one or more nodes to the server address space.
*/
export class AddNodesRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.nodesToAdd = (options.nodesToAdd) ? options.nodesToAdd : [];
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeArray(this.nodesToAdd, out);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.nodesToAdd = ec.decodeArray(inp, decodeAddNodesItem);
    }
    clone(target) {
        if (!target) {
            target = new AddNodesRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        if (this.nodesToAdd) {
            target.nodesToAdd = ec.cloneComplexArray(this.nodesToAdd);
        }
        return target;
    }
}
export function decodeAddNodesRequest(inp) {
    let obj = new AddNodesRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("AddNodesRequest", AddNodesRequest, makeExpandedNodeId(488, 0));
//# sourceMappingURL=AddNodesRequest.js.map