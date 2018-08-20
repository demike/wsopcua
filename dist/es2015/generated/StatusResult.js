import * as ec from '../basic-types';
import { DiagnosticInfo } from './DiagnosticInfo';
/**

*/
export class StatusResult {
    constructor(options) {
        options = options || {};
        this.statusCode = (options.statusCode) ? options.statusCode : null;
        this.diagnosticInfo = (options.diagnosticInfo) ? options.diagnosticInfo : new DiagnosticInfo();
    }
    encode(out) {
        ec.encodeStatusCode(this.statusCode, out);
        this.diagnosticInfo.encode(out);
    }
    decode(inp) {
        this.statusCode = ec.decodeStatusCode(inp);
        this.diagnosticInfo.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new StatusResult();
        }
        target.statusCode = this.statusCode;
        if (this.diagnosticInfo) {
            target.diagnosticInfo = this.diagnosticInfo.clone();
        }
        return target;
    }
}
export function decodeStatusResult(inp) {
    let obj = new StatusResult();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("StatusResult", StatusResult, makeExpandedNodeId(301, 0));
//# sourceMappingURL=StatusResult.js.map