import * as ec from '../basic-types';
import { LocalizedText } from './LocalizedText';
/**
The base attributes for all nodes.
*/
export class NodeAttributes {
    constructor(options) {
        options = options || {};
        this.specifiedAttributes = (options.specifiedAttributes) ? options.specifiedAttributes : null;
        this.displayName = (options.displayName) ? options.displayName : new LocalizedText();
        this.description = (options.description) ? options.description : new LocalizedText();
        this.writeMask = (options.writeMask) ? options.writeMask : null;
        this.userWriteMask = (options.userWriteMask) ? options.userWriteMask : null;
    }
    encode(out) {
        ec.encodeUInt32(this.specifiedAttributes, out);
        this.displayName.encode(out);
        this.description.encode(out);
        ec.encodeUInt32(this.writeMask, out);
        ec.encodeUInt32(this.userWriteMask, out);
    }
    decode(inp) {
        this.specifiedAttributes = ec.decodeUInt32(inp);
        this.displayName.decode(inp);
        this.description.decode(inp);
        this.writeMask = ec.decodeUInt32(inp);
        this.userWriteMask = ec.decodeUInt32(inp);
    }
    clone(target) {
        if (!target) {
            target = new NodeAttributes();
        }
        target.specifiedAttributes = this.specifiedAttributes;
        if (this.displayName) {
            target.displayName = this.displayName.clone();
        }
        if (this.description) {
            target.description = this.description.clone();
        }
        target.writeMask = this.writeMask;
        target.userWriteMask = this.userWriteMask;
        return target;
    }
}
export function decodeNodeAttributes(inp) {
    let obj = new NodeAttributes();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("NodeAttributes", NodeAttributes, makeExpandedNodeId(351, 0));
//# sourceMappingURL=NodeAttributes.js.map