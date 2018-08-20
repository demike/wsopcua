import * as ec from '../basic-types';
import { HistoryUpdateDetails } from './HistoryUpdateDetails';
/**

*/
export class DeleteEventDetails extends HistoryUpdateDetails {
    constructor(options) {
        options = options || {};
        super(options);
        this.eventIds = (options.eventIds) ? options.eventIds : [];
    }
    encode(out) {
        super.encode(out);
        ec.encodeArray(this.eventIds, out, ec.encodeByteString);
    }
    decode(inp) {
        super.decode(inp);
        this.eventIds = ec.decodeArray(inp, ec.decodeByteString);
    }
    clone(target) {
        if (!target) {
            target = new DeleteEventDetails();
        }
        super.clone(target);
        target.eventIds = ec.cloneArray(this.eventIds);
        return target;
    }
}
export function decodeDeleteEventDetails(inp) {
    let obj = new DeleteEventDetails();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DeleteEventDetails", DeleteEventDetails, makeExpandedNodeId(694, 0));
//# sourceMappingURL=DeleteEventDetails.js.map