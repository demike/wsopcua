import * as ec from '../basic-types';
import { encodeBrowseDirection, decodeBrowseDirection } from './BrowseDirection';
/**
A request to browse the the references from a node.
*/
export class BrowseDescription {
    constructor(options) {
        options = options || {};
        this.nodeId = (options.nodeId) ? options.nodeId : null;
        this.browseDirection = (options.browseDirection) ? options.browseDirection : null;
        this.referenceTypeId = (options.referenceTypeId) ? options.referenceTypeId : null;
        this.includeSubtypes = (options.includeSubtypes) ? options.includeSubtypes : null;
        this.nodeClassMask = (options.nodeClassMask) ? options.nodeClassMask : null;
        this.resultMask = (options.resultMask) ? options.resultMask : null;
    }
    encode(out) {
        ec.encodeNodeId(this.nodeId, out);
        encodeBrowseDirection(this.browseDirection, out);
        ec.encodeNodeId(this.referenceTypeId, out);
        ec.encodeBoolean(this.includeSubtypes, out);
        ec.encodeUInt32(this.nodeClassMask, out);
        ec.encodeUInt32(this.resultMask, out);
    }
    decode(inp) {
        this.nodeId = ec.decodeNodeId(inp);
        this.browseDirection = decodeBrowseDirection(inp);
        this.referenceTypeId = ec.decodeNodeId(inp);
        this.includeSubtypes = ec.decodeBoolean(inp);
        this.nodeClassMask = ec.decodeUInt32(inp);
        this.resultMask = ec.decodeUInt32(inp);
    }
    clone(target) {
        if (!target) {
            target = new BrowseDescription();
        }
        target.nodeId = this.nodeId;
        target.browseDirection = this.browseDirection;
        target.referenceTypeId = this.referenceTypeId;
        target.includeSubtypes = this.includeSubtypes;
        target.nodeClassMask = this.nodeClassMask;
        target.resultMask = this.resultMask;
        return target;
    }
}
export function decodeBrowseDescription(inp) {
    let obj = new BrowseDescription();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("BrowseDescription", BrowseDescription, makeExpandedNodeId(516, 0));
//# sourceMappingURL=BrowseDescription.js.map