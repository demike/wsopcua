import * as ec from '../basic-types';
import { QualifiedName } from './QualifiedName';
import { LocalizedText } from './LocalizedText';
import { encodeNodeClass, decodeNodeClass } from './NodeClass';
/**
The description of a reference.
*/
export class ReferenceDescription {
    constructor(options) {
        options = options || {};
        this.referenceTypeId = (options.referenceTypeId) ? options.referenceTypeId : null;
        this.isForward = (options.isForward) ? options.isForward : null;
        this.nodeId = (options.nodeId) ? options.nodeId : null;
        this.browseName = (options.browseName) ? options.browseName : new QualifiedName();
        this.displayName = (options.displayName) ? options.displayName : new LocalizedText();
        this.nodeClass = (options.nodeClass) ? options.nodeClass : null;
        this.typeDefinition = (options.typeDefinition) ? options.typeDefinition : null;
    }
    encode(out) {
        ec.encodeNodeId(this.referenceTypeId, out);
        ec.encodeBoolean(this.isForward, out);
        ec.encodeExpandedNodeId(this.nodeId, out);
        this.browseName.encode(out);
        this.displayName.encode(out);
        encodeNodeClass(this.nodeClass, out);
        ec.encodeExpandedNodeId(this.typeDefinition, out);
    }
    decode(inp) {
        this.referenceTypeId = ec.decodeNodeId(inp);
        this.isForward = ec.decodeBoolean(inp);
        this.nodeId = ec.decodeExpandedNodeId(inp);
        this.browseName.decode(inp);
        this.displayName.decode(inp);
        this.nodeClass = decodeNodeClass(inp);
        this.typeDefinition = ec.decodeExpandedNodeId(inp);
    }
    clone(target) {
        if (!target) {
            target = new ReferenceDescription();
        }
        target.referenceTypeId = this.referenceTypeId;
        target.isForward = this.isForward;
        target.nodeId = this.nodeId;
        if (this.browseName) {
            target.browseName = this.browseName.clone();
        }
        if (this.displayName) {
            target.displayName = this.displayName.clone();
        }
        target.nodeClass = this.nodeClass;
        target.typeDefinition = this.typeDefinition;
        return target;
    }
}
export function decodeReferenceDescription(inp) {
    let obj = new ReferenceDescription();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ReferenceDescription", ReferenceDescription, makeExpandedNodeId(520, 0));
//# sourceMappingURL=ReferenceDescription.js.map