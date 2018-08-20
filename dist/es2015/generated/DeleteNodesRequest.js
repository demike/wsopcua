import { RequestHeader } from './RequestHeader';
import { decodeDeleteNodesItem } from './DeleteNodesItem';
import * as ec from '../basic-types';
/**
Delete one or more nodes from the server address space.
*/
export class DeleteNodesRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.nodesToDelete = (options.nodesToDelete) ? options.nodesToDelete : [];
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeArray(this.nodesToDelete, out);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.nodesToDelete = ec.decodeArray(inp, decodeDeleteNodesItem);
    }
    clone(target) {
        if (!target) {
            target = new DeleteNodesRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        if (this.nodesToDelete) {
            target.nodesToDelete = ec.cloneComplexArray(this.nodesToDelete);
        }
        return target;
    }
}
export function decodeDeleteNodesRequest(inp) {
    let obj = new DeleteNodesRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DeleteNodesRequest", DeleteNodesRequest, makeExpandedNodeId(500, 0));
//# sourceMappingURL=DeleteNodesRequest.js.map