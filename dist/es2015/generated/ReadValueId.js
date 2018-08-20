import * as ec from '../basic-types';
import { QualifiedName } from './QualifiedName';
/**

*/
export class ReadValueId {
    constructor(options) {
        options = options || {};
        this.nodeId = (options.nodeId) ? options.nodeId : null;
        this.attributeId = (options.attributeId) ? options.attributeId : null;
        this.indexRange = (options.indexRange) ? options.indexRange : null;
        this.dataEncoding = (options.dataEncoding) ? options.dataEncoding : new QualifiedName();
    }
    encode(out) {
        ec.encodeNodeId(this.nodeId, out);
        ec.encodeUInt32(this.attributeId, out);
        ec.encodeString(this.indexRange, out);
        this.dataEncoding.encode(out);
    }
    decode(inp) {
        this.nodeId = ec.decodeNodeId(inp);
        this.attributeId = ec.decodeUInt32(inp);
        this.indexRange = ec.decodeString(inp);
        this.dataEncoding.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new ReadValueId();
        }
        target.nodeId = this.nodeId;
        target.attributeId = this.attributeId;
        target.indexRange = this.indexRange;
        if (this.dataEncoding) {
            target.dataEncoding = this.dataEncoding.clone();
        }
        return target;
    }
}
export function decodeReadValueId(inp) {
    let obj = new ReadValueId();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ReadValueId", ReadValueId, makeExpandedNodeId(628, 0));
//# sourceMappingURL=ReadValueId.js.map