import * as ec from '../basic-types';
/**

*/
export class HistoryReadResult {
    constructor(options) {
        options = options || {};
        this.statusCode = (options.statusCode) ? options.statusCode : null;
        this.continuationPoint = (options.continuationPoint) ? options.continuationPoint : null;
        this.historyData = (options.historyData) ? options.historyData : null;
    }
    encode(out) {
        ec.encodeStatusCode(this.statusCode, out);
        ec.encodeByteString(this.continuationPoint, out);
        ec.encodeExtensionObject(this.historyData, out);
    }
    decode(inp) {
        this.statusCode = ec.decodeStatusCode(inp);
        this.continuationPoint = ec.decodeByteString(inp);
        this.historyData = ec.decodeExtensionObject(inp);
    }
    clone(target) {
        if (!target) {
            target = new HistoryReadResult();
        }
        target.statusCode = this.statusCode;
        target.continuationPoint = this.continuationPoint;
        target.historyData = this.historyData;
        return target;
    }
}
export function decodeHistoryReadResult(inp) {
    let obj = new HistoryReadResult();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("HistoryReadResult", HistoryReadResult, makeExpandedNodeId(640, 0));
//# sourceMappingURL=HistoryReadResult.js.map