import * as ec from '../basic-types';
import { NodeAttributes } from './NodeAttributes';
/**
The attributes for a method node.
*/
export class MethodAttributes extends NodeAttributes {
    constructor(options) {
        options = options || {};
        super(options);
        this.executable = (options.executable) ? options.executable : null;
        this.userExecutable = (options.userExecutable) ? options.userExecutable : null;
    }
    encode(out) {
        super.encode(out);
        ec.encodeBoolean(this.executable, out);
        ec.encodeBoolean(this.userExecutable, out);
    }
    decode(inp) {
        super.decode(inp);
        this.executable = ec.decodeBoolean(inp);
        this.userExecutable = ec.decodeBoolean(inp);
    }
    clone(target) {
        if (!target) {
            target = new MethodAttributes();
        }
        super.clone(target);
        target.executable = this.executable;
        target.userExecutable = this.userExecutable;
        return target;
    }
}
export function decodeMethodAttributes(inp) {
    let obj = new MethodAttributes();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("MethodAttributes", MethodAttributes, makeExpandedNodeId(360, 0));
//# sourceMappingURL=MethodAttributes.js.map