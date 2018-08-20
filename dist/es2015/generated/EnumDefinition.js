import { decodeEnumField } from './EnumField';
import * as ec from '../basic-types';
/**

*/
export class EnumDefinition {
    constructor(options) {
        options = options || {};
        this.fields = (options.fields) ? options.fields : [];
    }
    encode(out) {
        ec.encodeArray(this.fields, out);
    }
    decode(inp) {
        this.fields = ec.decodeArray(inp, decodeEnumField);
    }
    clone(target) {
        if (!target) {
            target = new EnumDefinition();
        }
        if (this.fields) {
            target.fields = ec.cloneComplexArray(this.fields);
        }
        return target;
    }
}
export function decodeEnumDefinition(inp) {
    let obj = new EnumDefinition();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("EnumDefinition", EnumDefinition, makeExpandedNodeId(123, 0));
//# sourceMappingURL=EnumDefinition.js.map