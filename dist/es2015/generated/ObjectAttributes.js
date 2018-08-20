import * as ec from '../basic-types';
import { NodeAttributes } from './NodeAttributes';
/**
The attributes for an object node.
*/
export class ObjectAttributes extends NodeAttributes {
    constructor(options) {
        options = options || {};
        super(options);
        this.eventNotifier = (options.eventNotifier) ? options.eventNotifier : null;
    }
    encode(out) {
        super.encode(out);
        ec.encodeByte(this.eventNotifier, out);
    }
    decode(inp) {
        super.decode(inp);
        this.eventNotifier = ec.decodeByte(inp);
    }
    clone(target) {
        if (!target) {
            target = new ObjectAttributes();
        }
        super.clone(target);
        target.eventNotifier = this.eventNotifier;
        return target;
    }
}
export function decodeObjectAttributes(inp) {
    let obj = new ObjectAttributes();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ObjectAttributes", ObjectAttributes, makeExpandedNodeId(354, 0));
//# sourceMappingURL=ObjectAttributes.js.map