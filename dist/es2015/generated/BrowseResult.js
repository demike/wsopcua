import * as ec from '../basic-types';
import { decodeReferenceDescription } from './ReferenceDescription';
/**
The result of a browse operation.
*/
export class BrowseResult {
    constructor(options) {
        options = options || {};
        this.statusCode = (options.statusCode) ? options.statusCode : null;
        this.continuationPoint = (options.continuationPoint) ? options.continuationPoint : null;
        this.references = (options.references) ? options.references : [];
    }
    encode(out) {
        ec.encodeStatusCode(this.statusCode, out);
        ec.encodeByteString(this.continuationPoint, out);
        ec.encodeArray(this.references, out);
    }
    decode(inp) {
        this.statusCode = ec.decodeStatusCode(inp);
        this.continuationPoint = ec.decodeByteString(inp);
        this.references = ec.decodeArray(inp, decodeReferenceDescription);
    }
    clone(target) {
        if (!target) {
            target = new BrowseResult();
        }
        target.statusCode = this.statusCode;
        target.continuationPoint = this.continuationPoint;
        if (this.references) {
            target.references = ec.cloneComplexArray(this.references);
        }
        return target;
    }
}
export function decodeBrowseResult(inp) {
    let obj = new BrowseResult();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("BrowseResult", BrowseResult, makeExpandedNodeId(524, 0));
//# sourceMappingURL=BrowseResult.js.map