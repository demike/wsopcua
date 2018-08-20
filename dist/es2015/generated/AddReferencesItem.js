import * as ec from '../basic-types';
import { encodeNodeClass, decodeNodeClass } from './NodeClass';
/**
A request to add a reference to the server address space.
*/
export class AddReferencesItem {
    constructor(options) {
        options = options || {};
        this.sourceNodeId = (options.sourceNodeId) ? options.sourceNodeId : null;
        this.referenceTypeId = (options.referenceTypeId) ? options.referenceTypeId : null;
        this.isForward = (options.isForward) ? options.isForward : null;
        this.targetServerUri = (options.targetServerUri) ? options.targetServerUri : null;
        this.targetNodeId = (options.targetNodeId) ? options.targetNodeId : null;
        this.targetNodeClass = (options.targetNodeClass) ? options.targetNodeClass : null;
    }
    encode(out) {
        ec.encodeNodeId(this.sourceNodeId, out);
        ec.encodeNodeId(this.referenceTypeId, out);
        ec.encodeBoolean(this.isForward, out);
        ec.encodeString(this.targetServerUri, out);
        ec.encodeExpandedNodeId(this.targetNodeId, out);
        encodeNodeClass(this.targetNodeClass, out);
    }
    decode(inp) {
        this.sourceNodeId = ec.decodeNodeId(inp);
        this.referenceTypeId = ec.decodeNodeId(inp);
        this.isForward = ec.decodeBoolean(inp);
        this.targetServerUri = ec.decodeString(inp);
        this.targetNodeId = ec.decodeExpandedNodeId(inp);
        this.targetNodeClass = decodeNodeClass(inp);
    }
    clone(target) {
        if (!target) {
            target = new AddReferencesItem();
        }
        target.sourceNodeId = this.sourceNodeId;
        target.referenceTypeId = this.referenceTypeId;
        target.isForward = this.isForward;
        target.targetServerUri = this.targetServerUri;
        target.targetNodeId = this.targetNodeId;
        target.targetNodeClass = this.targetNodeClass;
        return target;
    }
}
export function decodeAddReferencesItem(inp) {
    let obj = new AddReferencesItem();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("AddReferencesItem", AddReferencesItem, makeExpandedNodeId(381, 0));
//# sourceMappingURL=AddReferencesItem.js.map