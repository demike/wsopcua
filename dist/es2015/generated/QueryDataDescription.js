import { RelativePath } from './RelativePath';
import * as ec from '../basic-types';
/**

*/
export class QueryDataDescription {
    constructor(options) {
        options = options || {};
        this.relativePath = (options.relativePath) ? options.relativePath : new RelativePath();
        this.attributeId = (options.attributeId) ? options.attributeId : null;
        this.indexRange = (options.indexRange) ? options.indexRange : null;
    }
    encode(out) {
        this.relativePath.encode(out);
        ec.encodeUInt32(this.attributeId, out);
        ec.encodeString(this.indexRange, out);
    }
    decode(inp) {
        this.relativePath.decode(inp);
        this.attributeId = ec.decodeUInt32(inp);
        this.indexRange = ec.decodeString(inp);
    }
    clone(target) {
        if (!target) {
            target = new QueryDataDescription();
        }
        if (this.relativePath) {
            target.relativePath = this.relativePath.clone();
        }
        target.attributeId = this.attributeId;
        target.indexRange = this.indexRange;
        return target;
    }
}
export function decodeQueryDataDescription(inp) {
    let obj = new QueryDataDescription();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("QueryDataDescription", QueryDataDescription, makeExpandedNodeId(572, 0));
//# sourceMappingURL=QueryDataDescription.js.map