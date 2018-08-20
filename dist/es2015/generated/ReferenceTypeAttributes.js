import * as ec from '../basic-types';
import { LocalizedText } from './LocalizedText';
import { NodeAttributes } from './NodeAttributes';
/**
The attributes for a reference type node.
*/
export class ReferenceTypeAttributes extends NodeAttributes {
    constructor(options) {
        options = options || {};
        super(options);
        this.isAbstract = (options.isAbstract) ? options.isAbstract : null;
        this.symmetric = (options.symmetric) ? options.symmetric : null;
        this.inverseName = (options.inverseName) ? options.inverseName : new LocalizedText();
    }
    encode(out) {
        super.encode(out);
        ec.encodeBoolean(this.isAbstract, out);
        ec.encodeBoolean(this.symmetric, out);
        this.inverseName.encode(out);
    }
    decode(inp) {
        super.decode(inp);
        this.isAbstract = ec.decodeBoolean(inp);
        this.symmetric = ec.decodeBoolean(inp);
        this.inverseName.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new ReferenceTypeAttributes();
        }
        super.clone(target);
        target.isAbstract = this.isAbstract;
        target.symmetric = this.symmetric;
        if (this.inverseName) {
            target.inverseName = this.inverseName.clone();
        }
        return target;
    }
}
export function decodeReferenceTypeAttributes(inp) {
    let obj = new ReferenceTypeAttributes();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ReferenceTypeAttributes", ReferenceTypeAttributes, makeExpandedNodeId(369, 0));
//# sourceMappingURL=ReferenceTypeAttributes.js.map