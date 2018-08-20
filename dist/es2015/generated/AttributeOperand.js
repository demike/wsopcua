import * as ec from '../basic-types';
import { RelativePath } from './RelativePath';
import { FilterOperand } from './FilterOperand';
/**

*/
export class AttributeOperand extends FilterOperand {
    constructor(options) {
        options = options || {};
        super();
        this.nodeId = (options.nodeId) ? options.nodeId : null;
        this.alias = (options.alias) ? options.alias : null;
        this.browsePath = (options.browsePath) ? options.browsePath : new RelativePath();
        this.attributeId = (options.attributeId) ? options.attributeId : null;
        this.indexRange = (options.indexRange) ? options.indexRange : null;
    }
    encode(out) {
        ec.encodeNodeId(this.nodeId, out);
        ec.encodeString(this.alias, out);
        this.browsePath.encode(out);
        ec.encodeUInt32(this.attributeId, out);
        ec.encodeString(this.indexRange, out);
    }
    decode(inp) {
        this.nodeId = ec.decodeNodeId(inp);
        this.alias = ec.decodeString(inp);
        this.browsePath.decode(inp);
        this.attributeId = ec.decodeUInt32(inp);
        this.indexRange = ec.decodeString(inp);
    }
    clone(target) {
        if (!target) {
            target = new AttributeOperand();
        }
        target.nodeId = this.nodeId;
        target.alias = this.alias;
        if (this.browsePath) {
            target.browsePath = this.browsePath.clone();
        }
        target.attributeId = this.attributeId;
        target.indexRange = this.indexRange;
        return target;
    }
}
export function decodeAttributeOperand(inp) {
    let obj = new AttributeOperand();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("AttributeOperand", AttributeOperand, makeExpandedNodeId(600, 0));
//# sourceMappingURL=AttributeOperand.js.map