import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
/**

*/
export class HistoryUpdateRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.historyUpdateDetails = (options.historyUpdateDetails) ? options.historyUpdateDetails : [];
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeArray(this.historyUpdateDetails, out, ec.encodeExtensionObject);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.historyUpdateDetails = ec.decodeArray(inp, ec.decodeExtensionObject);
    }
    clone(target) {
        if (!target) {
            target = new HistoryUpdateRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        target.historyUpdateDetails = ec.cloneArray(this.historyUpdateDetails);
        return target;
    }
}
export function decodeHistoryUpdateRequest(inp) {
    let obj = new HistoryUpdateRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("HistoryUpdateRequest", HistoryUpdateRequest, makeExpandedNodeId(700, 0));
//# sourceMappingURL=HistoryUpdateRequest.js.map