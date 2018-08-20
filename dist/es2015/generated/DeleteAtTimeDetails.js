import * as ec from '../basic-types';
import { HistoryUpdateDetails } from './HistoryUpdateDetails';
/**

*/
export class DeleteAtTimeDetails extends HistoryUpdateDetails {
    constructor(options) {
        options = options || {};
        super(options);
        this.reqTimes = (options.reqTimes) ? options.reqTimes : [];
    }
    encode(out) {
        super.encode(out);
        ec.encodeArray(this.reqTimes, out, ec.encodeDateTime);
    }
    decode(inp) {
        super.decode(inp);
        this.reqTimes = ec.decodeArray(inp, ec.decodeDateTime);
    }
    clone(target) {
        if (!target) {
            target = new DeleteAtTimeDetails();
        }
        super.clone(target);
        target.reqTimes = ec.cloneArray(this.reqTimes);
        return target;
    }
}
export function decodeDeleteAtTimeDetails(inp) {
    let obj = new DeleteAtTimeDetails();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DeleteAtTimeDetails", DeleteAtTimeDetails, makeExpandedNodeId(691, 0));
//# sourceMappingURL=DeleteAtTimeDetails.js.map