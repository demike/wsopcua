import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
import { encodeTimestampsToReturn, decodeTimestampsToReturn } from './TimestampsToReturn';
import { decodeReadValueId } from './ReadValueId';
/**

*/
export class ReadRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.maxAge = (options.maxAge) ? options.maxAge : null;
        this.timestampsToReturn = (options.timestampsToReturn) ? options.timestampsToReturn : null;
        this.nodesToRead = (options.nodesToRead) ? options.nodesToRead : [];
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeDouble(this.maxAge, out);
        encodeTimestampsToReturn(this.timestampsToReturn, out);
        ec.encodeArray(this.nodesToRead, out);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.maxAge = ec.decodeDouble(inp);
        this.timestampsToReturn = decodeTimestampsToReturn(inp);
        this.nodesToRead = ec.decodeArray(inp, decodeReadValueId);
    }
    clone(target) {
        if (!target) {
            target = new ReadRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        target.maxAge = this.maxAge;
        target.timestampsToReturn = this.timestampsToReturn;
        if (this.nodesToRead) {
            target.nodesToRead = ec.cloneComplexArray(this.nodesToRead);
        }
        return target;
    }
}
export function decodeReadRequest(inp) {
    let obj = new ReadRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ReadRequest", ReadRequest, makeExpandedNodeId(631, 0));
//# sourceMappingURL=ReadRequest.js.map