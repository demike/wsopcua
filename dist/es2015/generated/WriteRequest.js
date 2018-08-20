import { RequestHeader } from './RequestHeader';
import { decodeWriteValue } from './WriteValue';
import * as ec from '../basic-types';
/**

*/
export class WriteRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.nodesToWrite = (options.nodesToWrite) ? options.nodesToWrite : [];
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeArray(this.nodesToWrite, out);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.nodesToWrite = ec.decodeArray(inp, decodeWriteValue);
    }
    clone(target) {
        if (!target) {
            target = new WriteRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        if (this.nodesToWrite) {
            target.nodesToWrite = ec.cloneComplexArray(this.nodesToWrite);
        }
        return target;
    }
}
export function decodeWriteRequest(inp) {
    let obj = new WriteRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("WriteRequest", WriteRequest, makeExpandedNodeId(673, 0));
//# sourceMappingURL=WriteRequest.js.map