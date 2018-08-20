import * as ec from '../basic-types';
import { decodeVariant } from '../variant';
/**

*/
export class CallMethodRequest {
    constructor(options) {
        options = options || {};
        this.objectId = (options.objectId) ? options.objectId : null;
        this.methodId = (options.methodId) ? options.methodId : null;
        this.inputArguments = (options.inputArguments) ? options.inputArguments : [];
    }
    encode(out) {
        ec.encodeNodeId(this.objectId, out);
        ec.encodeNodeId(this.methodId, out);
        ec.encodeArray(this.inputArguments, out);
    }
    decode(inp) {
        this.objectId = ec.decodeNodeId(inp);
        this.methodId = ec.decodeNodeId(inp);
        this.inputArguments = ec.decodeArray(inp, decodeVariant);
    }
    clone(target) {
        if (!target) {
            target = new CallMethodRequest();
        }
        target.objectId = this.objectId;
        target.methodId = this.methodId;
        if (this.inputArguments) {
            target.inputArguments = ec.cloneComplexArray(this.inputArguments);
        }
        return target;
    }
}
export function decodeCallMethodRequest(inp) {
    let obj = new CallMethodRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("CallMethodRequest", CallMethodRequest, makeExpandedNodeId(706, 0));
//# sourceMappingURL=CallMethodRequest.js.map