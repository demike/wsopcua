import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
/**

*/
export class QueryNextRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.releaseContinuationPoint = (options.releaseContinuationPoint) ? options.releaseContinuationPoint : null;
        this.continuationPoint = (options.continuationPoint) ? options.continuationPoint : null;
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeBoolean(this.releaseContinuationPoint, out);
        ec.encodeByteString(this.continuationPoint, out);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.releaseContinuationPoint = ec.decodeBoolean(inp);
        this.continuationPoint = ec.decodeByteString(inp);
    }
    clone(target) {
        if (!target) {
            target = new QueryNextRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        target.releaseContinuationPoint = this.releaseContinuationPoint;
        target.continuationPoint = this.continuationPoint;
        return target;
    }
}
export function decodeQueryNextRequest(inp) {
    let obj = new QueryNextRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("QueryNextRequest", QueryNextRequest, makeExpandedNodeId(621, 0));
//# sourceMappingURL=QueryNextRequest.js.map