import { RequestHeader } from './RequestHeader';
import { decodeCallMethodRequest } from './CallMethodRequest';
import * as ec from '../basic-types';
/**

*/
export class CallRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.methodsToCall = (options.methodsToCall) ? options.methodsToCall : [];
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeArray(this.methodsToCall, out);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.methodsToCall = ec.decodeArray(inp, decodeCallMethodRequest);
    }
    clone(target) {
        if (!target) {
            target = new CallRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        if (this.methodsToCall) {
            target.methodsToCall = ec.cloneComplexArray(this.methodsToCall);
        }
        return target;
    }
}
export function decodeCallRequest(inp) {
    let obj = new CallRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("CallRequest", CallRequest, makeExpandedNodeId(712, 0));
//# sourceMappingURL=CallRequest.js.map