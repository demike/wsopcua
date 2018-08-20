import { ResponseHeader } from './ResponseHeader';
import { decodeMonitoredItemCreateResult } from './MonitoredItemCreateResult';
import { decodeDiagnosticInfo } from './DiagnosticInfo';
import * as ec from '../basic-types';
/**

*/
export class CreateMonitoredItemsResponse {
    constructor(options) {
        options = options || {};
        this.responseHeader = (options.responseHeader) ? options.responseHeader : new ResponseHeader();
        this.results = (options.results) ? options.results : [];
        this.diagnosticInfos = (options.diagnosticInfos) ? options.diagnosticInfos : [];
    }
    encode(out) {
        this.responseHeader.encode(out);
        ec.encodeArray(this.results, out);
        ec.encodeArray(this.diagnosticInfos, out);
    }
    decode(inp) {
        this.responseHeader.decode(inp);
        this.results = ec.decodeArray(inp, decodeMonitoredItemCreateResult);
        this.diagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);
    }
    clone(target) {
        if (!target) {
            target = new CreateMonitoredItemsResponse();
        }
        if (this.responseHeader) {
            target.responseHeader = this.responseHeader.clone();
        }
        if (this.results) {
            target.results = ec.cloneComplexArray(this.results);
        }
        if (this.diagnosticInfos) {
            target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos);
        }
        return target;
    }
}
export function decodeCreateMonitoredItemsResponse(inp) {
    let obj = new CreateMonitoredItemsResponse();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("CreateMonitoredItemsResponse", CreateMonitoredItemsResponse, makeExpandedNodeId(754, 0));
//# sourceMappingURL=CreateMonitoredItemsResponse.js.map