import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
/**
Registers one or more nodes for repeated use within a session.
*/
export class RegisterNodesRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.nodesToRegister = (options.nodesToRegister) ? options.nodesToRegister : [];
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeArray(this.nodesToRegister, out, ec.encodeNodeId);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.nodesToRegister = ec.decodeArray(inp, ec.decodeNodeId);
    }
    clone(target) {
        if (!target) {
            target = new RegisterNodesRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        target.nodesToRegister = ec.cloneArray(this.nodesToRegister);
        return target;
    }
}
export function decodeRegisterNodesRequest(inp) {
    let obj = new RegisterNodesRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("RegisterNodesRequest", RegisterNodesRequest, makeExpandedNodeId(560, 0));
//# sourceMappingURL=RegisterNodesRequest.js.map