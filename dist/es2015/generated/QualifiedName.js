import * as ec from '../basic-types';
/**
A string qualified with a namespace index.
*/
export class QualifiedName {
    constructor(options) {
        options = options || {};
        this.namespaceIndex = (options.namespaceIndex) ? options.namespaceIndex : null;
        this.name = (options.name) ? options.name : null;
    }
    encode(out) {
        ec.encodeUInt16(this.namespaceIndex, out);
        ec.encodeString(this.name, out);
    }
    decode(inp) {
        this.namespaceIndex = ec.decodeUInt16(inp);
        this.name = ec.decodeString(inp);
    }
    clone(target) {
        if (!target) {
            target = new QualifiedName();
        }
        target.namespaceIndex = this.namespaceIndex;
        target.name = this.name;
        return target;
    }
}
export function decodeQualifiedName(inp) {
    let obj = new QualifiedName();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("QualifiedName", QualifiedName, makeExpandedNodeId(20, 0));
//# sourceMappingURL=QualifiedName.js.map