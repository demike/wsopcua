import * as ec from '../basic-types';
import { NodeAttributes } from './NodeAttributes';
/**
The attributes for a view node.
*/
export class ViewAttributes extends NodeAttributes {
    constructor(options) {
        options = options || {};
        super(options);
        this.containsNoLoops = (options.containsNoLoops) ? options.containsNoLoops : null;
        this.eventNotifier = (options.eventNotifier) ? options.eventNotifier : null;
    }
    encode(out) {
        super.encode(out);
        ec.encodeBoolean(this.containsNoLoops, out);
        ec.encodeByte(this.eventNotifier, out);
    }
    decode(inp) {
        super.decode(inp);
        this.containsNoLoops = ec.decodeBoolean(inp);
        this.eventNotifier = ec.decodeByte(inp);
    }
    clone(target) {
        if (!target) {
            target = new ViewAttributes();
        }
        super.clone(target);
        target.containsNoLoops = this.containsNoLoops;
        target.eventNotifier = this.eventNotifier;
        return target;
    }
}
export function decodeViewAttributes(inp) {
    let obj = new ViewAttributes();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ViewAttributes", ViewAttributes, makeExpandedNodeId(375, 0));
//# sourceMappingURL=ViewAttributes.js.map