import { decodeGenericAttributeValue } from './GenericAttributeValue';
import * as ec from '../basic-types';
import { NodeAttributes } from './NodeAttributes';
/**

*/
export class GenericAttributes extends NodeAttributes {
    constructor(options) {
        options = options || {};
        super(options);
        this.attributeValues = (options.attributeValues) ? options.attributeValues : [];
    }
    encode(out) {
        super.encode(out);
        ec.encodeArray(this.attributeValues, out);
    }
    decode(inp) {
        super.decode(inp);
        this.attributeValues = ec.decodeArray(inp, decodeGenericAttributeValue);
    }
    clone(target) {
        if (!target) {
            target = new GenericAttributes();
        }
        super.clone(target);
        if (this.attributeValues) {
            target.attributeValues = ec.cloneComplexArray(this.attributeValues);
        }
        return target;
    }
}
export function decodeGenericAttributes(inp) {
    let obj = new GenericAttributes();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("GenericAttributes", GenericAttributes, makeExpandedNodeId(17611, 0));
//# sourceMappingURL=GenericAttributes.js.map