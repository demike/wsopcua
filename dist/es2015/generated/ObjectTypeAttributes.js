import * as ec from '../basic-types';
import { NodeAttributes } from './NodeAttributes';
/**
The attributes for an object type node.
*/
export class ObjectTypeAttributes extends NodeAttributes {
    constructor(options) {
        options = options || {};
        super(options);
        this.isAbstract = (options.isAbstract) ? options.isAbstract : null;
    }
    encode(out) {
        super.encode(out);
        ec.encodeBoolean(this.isAbstract, out);
    }
    decode(inp) {
        super.decode(inp);
        this.isAbstract = ec.decodeBoolean(inp);
    }
    clone(target) {
        if (!target) {
            target = new ObjectTypeAttributes();
        }
        super.clone(target);
        target.isAbstract = this.isAbstract;
        return target;
    }
}
export function decodeObjectTypeAttributes(inp) {
    let obj = new ObjectTypeAttributes();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ObjectTypeAttributes", ObjectTypeAttributes, makeExpandedNodeId(363, 0));
//# sourceMappingURL=ObjectTypeAttributes.js.map