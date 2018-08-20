import * as ec from '../basic-types';
import { DataValue } from './DataValue';
/**

*/
export class WriteValue {
    constructor(options) {
        options = options || {};
        this.nodeId = (options.nodeId) ? options.nodeId : null;
        this.attributeId = (options.attributeId) ? options.attributeId : null;
        this.indexRange = (options.indexRange) ? options.indexRange : null;
        this.value = (options.value) ? options.value : new DataValue();
    }
    encode(out) {
        ec.encodeNodeId(this.nodeId, out);
        ec.encodeUInt32(this.attributeId, out);
        ec.encodeString(this.indexRange, out);
        this.value.encode(out);
    }
    decode(inp) {
        this.nodeId = ec.decodeNodeId(inp);
        this.attributeId = ec.decodeUInt32(inp);
        this.indexRange = ec.decodeString(inp);
        this.value.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new WriteValue();
        }
        target.nodeId = this.nodeId;
        target.attributeId = this.attributeId;
        target.indexRange = this.indexRange;
        if (this.value) {
            target.value = this.value.clone();
        }
        return target;
    }
}
export function decodeWriteValue(inp) {
    let obj = new WriteValue();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("WriteValue", WriteValue, makeExpandedNodeId(670, 0));
//# sourceMappingURL=WriteValue.js.map