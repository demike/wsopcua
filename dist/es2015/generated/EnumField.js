import * as ec from '../basic-types';
import { EnumValueType } from './EnumValueType';
/**

*/
export class EnumField extends EnumValueType {
    constructor(options) {
        options = options || {};
        super(options);
        this.name = (options.name) ? options.name : null;
    }
    encode(out) {
        super.encode(out);
        ec.encodeString(this.name, out);
    }
    decode(inp) {
        super.decode(inp);
        this.name = ec.decodeString(inp);
    }
    clone(target) {
        if (!target) {
            target = new EnumField();
        }
        super.clone(target);
        target.name = this.name;
        return target;
    }
}
export function decodeEnumField(inp) {
    let obj = new EnumField();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("EnumField", EnumField, makeExpandedNodeId(14845, 0));
//# sourceMappingURL=EnumField.js.map