import * as ec from '../basic-types';
import { decodeBrowsePathTarget } from './BrowsePathTarget';
/**
The result of a translate opearation.
*/
export class BrowsePathResult {
    constructor(options) {
        options = options || {};
        this.statusCode = (options.statusCode) ? options.statusCode : null;
        this.targets = (options.targets) ? options.targets : [];
    }
    encode(out) {
        ec.encodeStatusCode(this.statusCode, out);
        ec.encodeArray(this.targets, out);
    }
    decode(inp) {
        this.statusCode = ec.decodeStatusCode(inp);
        this.targets = ec.decodeArray(inp, decodeBrowsePathTarget);
    }
    clone(target) {
        if (!target) {
            target = new BrowsePathResult();
        }
        target.statusCode = this.statusCode;
        if (this.targets) {
            target.targets = ec.cloneComplexArray(this.targets);
        }
        return target;
    }
}
export function decodeBrowsePathResult(inp) {
    let obj = new BrowsePathResult();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("BrowsePathResult", BrowsePathResult, makeExpandedNodeId(551, 0));
//# sourceMappingURL=BrowsePathResult.js.map