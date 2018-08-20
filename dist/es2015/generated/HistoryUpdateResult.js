import * as ec from '../basic-types';
import { decodeDiagnosticInfo } from './DiagnosticInfo';
/**

*/
export class HistoryUpdateResult {
    constructor(options) {
        options = options || {};
        this.statusCode = (options.statusCode) ? options.statusCode : null;
        this.operationResults = (options.operationResults) ? options.operationResults : [];
        this.diagnosticInfos = (options.diagnosticInfos) ? options.diagnosticInfos : [];
    }
    encode(out) {
        ec.encodeStatusCode(this.statusCode, out);
        ec.encodeArray(this.operationResults, out, ec.encodeStatusCode);
        ec.encodeArray(this.diagnosticInfos, out);
    }
    decode(inp) {
        this.statusCode = ec.decodeStatusCode(inp);
        this.operationResults = ec.decodeArray(inp, ec.decodeStatusCode);
        this.diagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);
    }
    clone(target) {
        if (!target) {
            target = new HistoryUpdateResult();
        }
        target.statusCode = this.statusCode;
        target.operationResults = ec.cloneArray(this.operationResults);
        if (this.diagnosticInfos) {
            target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos);
        }
        return target;
    }
}
export function decodeHistoryUpdateResult(inp) {
    let obj = new HistoryUpdateResult();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("HistoryUpdateResult", HistoryUpdateResult, makeExpandedNodeId(697, 0));
//# sourceMappingURL=HistoryUpdateResult.js.map