import * as ec from '../basic-types';
import { Variant } from '../variant';
/**

*/
export class GenericAttributeValue {
    constructor(options) {
        options = options || {};
        this.attributeId = (options.attributeId) ? options.attributeId : null;
        this.value = (options.value) ? options.value : new Variant();
    }
    encode(out) {
        ec.encodeUInt32(this.attributeId, out);
        this.value.encode(out);
    }
    decode(inp) {
        this.attributeId = ec.decodeUInt32(inp);
        this.value.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new GenericAttributeValue();
        }
        target.attributeId = this.attributeId;
        if (this.value) {
            target.value = this.value.clone();
        }
        return target;
    }
}
export function decodeGenericAttributeValue(inp) {
    let obj = new GenericAttributeValue();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("GenericAttributeValue", GenericAttributeValue, makeExpandedNodeId(17610, 0));
//# sourceMappingURL=GenericAttributeValue.js.map