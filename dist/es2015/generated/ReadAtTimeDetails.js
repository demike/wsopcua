import * as ec from '../basic-types';
import { HistoryReadDetails } from './HistoryReadDetails';
/**

*/
export class ReadAtTimeDetails extends HistoryReadDetails {
    constructor(options) {
        options = options || {};
        super();
        this.reqTimes = (options.reqTimes) ? options.reqTimes : [];
        this.useSimpleBounds = (options.useSimpleBounds) ? options.useSimpleBounds : null;
    }
    encode(out) {
        ec.encodeArray(this.reqTimes, out, ec.encodeDateTime);
        ec.encodeBoolean(this.useSimpleBounds, out);
    }
    decode(inp) {
        this.reqTimes = ec.decodeArray(inp, ec.decodeDateTime);
        this.useSimpleBounds = ec.decodeBoolean(inp);
    }
    clone(target) {
        if (!target) {
            target = new ReadAtTimeDetails();
        }
        target.reqTimes = ec.cloneArray(this.reqTimes);
        target.useSimpleBounds = this.useSimpleBounds;
        return target;
    }
}
export function decodeReadAtTimeDetails(inp) {
    let obj = new ReadAtTimeDetails();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ReadAtTimeDetails", ReadAtTimeDetails, makeExpandedNodeId(655, 0));
//# sourceMappingURL=ReadAtTimeDetails.js.map