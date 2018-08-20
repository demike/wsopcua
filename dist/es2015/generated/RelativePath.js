import { decodeRelativePathElement } from './RelativePathElement';
import * as ec from '../basic-types';
/**
A relative path constructed from reference types and browse names.
*/
export class RelativePath {
    constructor(options) {
        options = options || {};
        this.elements = (options.elements) ? options.elements : [];
    }
    encode(out) {
        ec.encodeArray(this.elements, out);
    }
    decode(inp) {
        this.elements = ec.decodeArray(inp, decodeRelativePathElement);
    }
    clone(target) {
        if (!target) {
            target = new RelativePath();
        }
        if (this.elements) {
            target.elements = ec.cloneComplexArray(this.elements);
        }
        return target;
    }
}
export function decodeRelativePath(inp) {
    let obj = new RelativePath();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("RelativePath", RelativePath, makeExpandedNodeId(542, 0));
//# sourceMappingURL=RelativePath.js.map