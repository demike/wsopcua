import * as ec from '../basic-types';
/**
A result of an add node operation.
*/
export class AddNodesResult {
    constructor(options) {
        options = options || {};
        this.statusCode = (options.statusCode) ? options.statusCode : null;
        this.addedNodeId = (options.addedNodeId) ? options.addedNodeId : null;
    }
    encode(out) {
        ec.encodeStatusCode(this.statusCode, out);
        ec.encodeNodeId(this.addedNodeId, out);
    }
    decode(inp) {
        this.statusCode = ec.decodeStatusCode(inp);
        this.addedNodeId = ec.decodeNodeId(inp);
    }
    clone(target) {
        if (!target) {
            target = new AddNodesResult();
        }
        target.statusCode = this.statusCode;
        target.addedNodeId = this.addedNodeId;
        return target;
    }
}
export function decodeAddNodesResult(inp) {
    let obj = new AddNodesResult();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("AddNodesResult", AddNodesResult, makeExpandedNodeId(485, 0));
//# sourceMappingURL=AddNodesResult.js.map