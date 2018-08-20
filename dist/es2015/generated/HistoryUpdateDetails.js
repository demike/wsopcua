import * as ec from '../basic-types';
/**

*/
export class HistoryUpdateDetails {
    constructor(options) {
        options = options || {};
        this.nodeId = (options.nodeId) ? options.nodeId : null;
    }
    encode(out) {
        ec.encodeNodeId(this.nodeId, out);
    }
    decode(inp) {
        this.nodeId = ec.decodeNodeId(inp);
    }
    clone(target) {
        if (!target) {
            target = new HistoryUpdateDetails();
        }
        target.nodeId = this.nodeId;
        return target;
    }
}
export function decodeHistoryUpdateDetails(inp) {
    let obj = new HistoryUpdateDetails();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("HistoryUpdateDetails", HistoryUpdateDetails, makeExpandedNodeId(679, 0));
//# sourceMappingURL=HistoryUpdateDetails.js.map