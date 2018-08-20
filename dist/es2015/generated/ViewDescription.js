import * as ec from '../basic-types';
/**
The view to browse.
*/
export class ViewDescription {
    constructor(options) {
        options = options || {};
        this.viewId = (options.viewId) ? options.viewId : null;
        this.timestamp = (options.timestamp) ? options.timestamp : null;
        this.viewVersion = (options.viewVersion) ? options.viewVersion : null;
    }
    encode(out) {
        ec.encodeNodeId(this.viewId, out);
        ec.encodeDateTime(this.timestamp, out);
        ec.encodeUInt32(this.viewVersion, out);
    }
    decode(inp) {
        this.viewId = ec.decodeNodeId(inp);
        this.timestamp = ec.decodeDateTime(inp);
        this.viewVersion = ec.decodeUInt32(inp);
    }
    clone(target) {
        if (!target) {
            target = new ViewDescription();
        }
        target.viewId = this.viewId;
        target.timestamp = this.timestamp;
        target.viewVersion = this.viewVersion;
        return target;
    }
}
export function decodeViewDescription(inp) {
    let obj = new ViewDescription();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ViewDescription", ViewDescription, makeExpandedNodeId(513, 0));
//# sourceMappingURL=ViewDescription.js.map