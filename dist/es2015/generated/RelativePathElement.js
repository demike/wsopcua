import * as ec from '../basic-types';
import { QualifiedName } from './QualifiedName';
/**
An element in a relative path.
*/
export class RelativePathElement {
    constructor(options) {
        options = options || {};
        this.referenceTypeId = (options.referenceTypeId) ? options.referenceTypeId : null;
        this.isInverse = (options.isInverse) ? options.isInverse : null;
        this.includeSubtypes = (options.includeSubtypes) ? options.includeSubtypes : null;
        this.targetName = (options.targetName) ? options.targetName : new QualifiedName();
    }
    encode(out) {
        ec.encodeNodeId(this.referenceTypeId, out);
        ec.encodeBoolean(this.isInverse, out);
        ec.encodeBoolean(this.includeSubtypes, out);
        this.targetName.encode(out);
    }
    decode(inp) {
        this.referenceTypeId = ec.decodeNodeId(inp);
        this.isInverse = ec.decodeBoolean(inp);
        this.includeSubtypes = ec.decodeBoolean(inp);
        this.targetName.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new RelativePathElement();
        }
        target.referenceTypeId = this.referenceTypeId;
        target.isInverse = this.isInverse;
        target.includeSubtypes = this.includeSubtypes;
        if (this.targetName) {
            target.targetName = this.targetName.clone();
        }
        return target;
    }
}
export function decodeRelativePathElement(inp) {
    let obj = new RelativePathElement();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("RelativePathElement", RelativePathElement, makeExpandedNodeId(539, 0));
//# sourceMappingURL=RelativePathElement.js.map