import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
/**
Registers one or more nodes for repeated use within a session.
*/
export class RegisterNodesResponse {
    constructor(options) {
        options = options || {};
        this.responseHeader = (options.responseHeader) ? options.responseHeader : new ResponseHeader();
        this.registeredNodeIds = (options.registeredNodeIds) ? options.registeredNodeIds : [];
    }
    encode(out) {
        this.responseHeader.encode(out);
        ec.encodeArray(this.registeredNodeIds, out, ec.encodeNodeId);
    }
    decode(inp) {
        this.responseHeader.decode(inp);
        this.registeredNodeIds = ec.decodeArray(inp, ec.decodeNodeId);
    }
    clone(target) {
        if (!target) {
            target = new RegisterNodesResponse();
        }
        if (this.responseHeader) {
            target.responseHeader = this.responseHeader.clone();
        }
        target.registeredNodeIds = ec.cloneArray(this.registeredNodeIds);
        return target;
    }
}
export function decodeRegisterNodesResponse(inp) {
    let obj = new RegisterNodesResponse();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("RegisterNodesResponse", RegisterNodesResponse, makeExpandedNodeId(563, 0));
//# sourceMappingURL=RegisterNodesResponse.js.map