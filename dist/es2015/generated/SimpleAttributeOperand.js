import * as ec from '../basic-types';
import { decodeQualifiedName } from './QualifiedName';
import { FilterOperand } from './FilterOperand';
/**

*/
export class SimpleAttributeOperand extends FilterOperand {
    constructor(options) {
        options = options || {};
        super();
        this.typeDefinitionId = (options.typeDefinitionId) ? options.typeDefinitionId : null;
        this.browsePath = (options.browsePath) ? options.browsePath : [];
        this.attributeId = (options.attributeId) ? options.attributeId : null;
        this.indexRange = (options.indexRange) ? options.indexRange : null;
    }
    encode(out) {
        ec.encodeNodeId(this.typeDefinitionId, out);
        ec.encodeArray(this.browsePath, out);
        ec.encodeUInt32(this.attributeId, out);
        ec.encodeString(this.indexRange, out);
    }
    decode(inp) {
        this.typeDefinitionId = ec.decodeNodeId(inp);
        this.browsePath = ec.decodeArray(inp, decodeQualifiedName);
        this.attributeId = ec.decodeUInt32(inp);
        this.indexRange = ec.decodeString(inp);
    }
    clone(target) {
        if (!target) {
            target = new SimpleAttributeOperand();
        }
        target.typeDefinitionId = this.typeDefinitionId;
        if (this.browsePath) {
            target.browsePath = ec.cloneComplexArray(this.browsePath);
        }
        target.attributeId = this.attributeId;
        target.indexRange = this.indexRange;
        return target;
    }
}
export function decodeSimpleAttributeOperand(inp) {
    let obj = new SimpleAttributeOperand();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("SimpleAttributeOperand", SimpleAttributeOperand, makeExpandedNodeId(603, 0));
//# sourceMappingURL=SimpleAttributeOperand.js.map