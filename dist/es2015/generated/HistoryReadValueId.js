import * as ec from '../basic-types';
import { QualifiedName } from './QualifiedName';
/**

*/
export class HistoryReadValueId {
    constructor(options) {
        options = options || {};
        this.nodeId = (options.nodeId) ? options.nodeId : null;
        this.indexRange = (options.indexRange) ? options.indexRange : null;
        this.dataEncoding = (options.dataEncoding) ? options.dataEncoding : new QualifiedName();
        this.continuationPoint = (options.continuationPoint) ? options.continuationPoint : null;
    }
    encode(out) {
        ec.encodeNodeId(this.nodeId, out);
        ec.encodeString(this.indexRange, out);
        this.dataEncoding.encode(out);
        ec.encodeByteString(this.continuationPoint, out);
    }
    decode(inp) {
        this.nodeId = ec.decodeNodeId(inp);
        this.indexRange = ec.decodeString(inp);
        this.dataEncoding.decode(inp);
        this.continuationPoint = ec.decodeByteString(inp);
    }
    clone(target) {
        if (!target) {
            target = new HistoryReadValueId();
        }
        target.nodeId = this.nodeId;
        target.indexRange = this.indexRange;
        if (this.dataEncoding) {
            target.dataEncoding = this.dataEncoding.clone();
        }
        target.continuationPoint = this.continuationPoint;
        return target;
    }
}
export function decodeHistoryReadValueId(inp) {
    let obj = new HistoryReadValueId();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("HistoryReadValueId", HistoryReadValueId, makeExpandedNodeId(637, 0));
//# sourceMappingURL=HistoryReadValueId.js.map