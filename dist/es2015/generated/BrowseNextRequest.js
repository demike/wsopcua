import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
/**
Continues one or more browse operations.
*/
export class BrowseNextRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.releaseContinuationPoints = (options.releaseContinuationPoints) ? options.releaseContinuationPoints : null;
        this.continuationPoints = (options.continuationPoints) ? options.continuationPoints : [];
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeBoolean(this.releaseContinuationPoints, out);
        ec.encodeArray(this.continuationPoints, out, ec.encodeByteString);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.releaseContinuationPoints = ec.decodeBoolean(inp);
        this.continuationPoints = ec.decodeArray(inp, ec.decodeByteString);
    }
    clone(target) {
        if (!target) {
            target = new BrowseNextRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        target.releaseContinuationPoints = this.releaseContinuationPoints;
        target.continuationPoints = ec.cloneArray(this.continuationPoints);
        return target;
    }
}
export function decodeBrowseNextRequest(inp) {
    let obj = new BrowseNextRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("BrowseNextRequest", BrowseNextRequest, makeExpandedNodeId(533, 0));
//# sourceMappingURL=BrowseNextRequest.js.map