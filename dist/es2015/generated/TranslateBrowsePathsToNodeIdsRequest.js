import { RequestHeader } from './RequestHeader';
import { decodeBrowsePath } from './BrowsePath';
import * as ec from '../basic-types';
/**
Translates one or more paths in the server address space.
*/
export class TranslateBrowsePathsToNodeIdsRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.browsePaths = (options.browsePaths) ? options.browsePaths : [];
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeArray(this.browsePaths, out);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.browsePaths = ec.decodeArray(inp, decodeBrowsePath);
    }
    clone(target) {
        if (!target) {
            target = new TranslateBrowsePathsToNodeIdsRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        if (this.browsePaths) {
            target.browsePaths = ec.cloneComplexArray(this.browsePaths);
        }
        return target;
    }
}
export function decodeTranslateBrowsePathsToNodeIdsRequest(inp) {
    let obj = new TranslateBrowsePathsToNodeIdsRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("TranslateBrowsePathsToNodeIdsRequest", TranslateBrowsePathsToNodeIdsRequest, makeExpandedNodeId(554, 0));
//# sourceMappingURL=TranslateBrowsePathsToNodeIdsRequest.js.map