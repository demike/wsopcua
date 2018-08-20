import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
/**

*/
export class FindServersOnNetworkRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.startingRecordId = (options.startingRecordId) ? options.startingRecordId : null;
        this.maxRecordsToReturn = (options.maxRecordsToReturn) ? options.maxRecordsToReturn : null;
        this.serverCapabilityFilter = (options.serverCapabilityFilter) ? options.serverCapabilityFilter : [];
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeUInt32(this.startingRecordId, out);
        ec.encodeUInt32(this.maxRecordsToReturn, out);
        ec.encodeArray(this.serverCapabilityFilter, out, ec.encodeString);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.startingRecordId = ec.decodeUInt32(inp);
        this.maxRecordsToReturn = ec.decodeUInt32(inp);
        this.serverCapabilityFilter = ec.decodeArray(inp, ec.decodeString);
    }
    clone(target) {
        if (!target) {
            target = new FindServersOnNetworkRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        target.startingRecordId = this.startingRecordId;
        target.maxRecordsToReturn = this.maxRecordsToReturn;
        target.serverCapabilityFilter = ec.cloneArray(this.serverCapabilityFilter);
        return target;
    }
}
export function decodeFindServersOnNetworkRequest(inp) {
    let obj = new FindServersOnNetworkRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("FindServersOnNetworkRequest", FindServersOnNetworkRequest, makeExpandedNodeId(12208, 0));
//# sourceMappingURL=FindServersOnNetworkRequest.js.map