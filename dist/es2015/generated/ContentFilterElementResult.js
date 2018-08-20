import * as ec from '../basic-types';
import { decodeDiagnosticInfo } from './DiagnosticInfo';
/**

*/
export class ContentFilterElementResult {
    constructor(options) {
        options = options || {};
        this.statusCode = (options.statusCode) ? options.statusCode : null;
        this.operandStatusCodes = (options.operandStatusCodes) ? options.operandStatusCodes : [];
        this.operandDiagnosticInfos = (options.operandDiagnosticInfos) ? options.operandDiagnosticInfos : [];
    }
    encode(out) {
        ec.encodeStatusCode(this.statusCode, out);
        ec.encodeArray(this.operandStatusCodes, out, ec.encodeStatusCode);
        ec.encodeArray(this.operandDiagnosticInfos, out);
    }
    decode(inp) {
        this.statusCode = ec.decodeStatusCode(inp);
        this.operandStatusCodes = ec.decodeArray(inp, ec.decodeStatusCode);
        this.operandDiagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);
    }
    clone(target) {
        if (!target) {
            target = new ContentFilterElementResult();
        }
        target.statusCode = this.statusCode;
        target.operandStatusCodes = ec.cloneArray(this.operandStatusCodes);
        if (this.operandDiagnosticInfos) {
            target.operandDiagnosticInfos = ec.cloneComplexArray(this.operandDiagnosticInfos);
        }
        return target;
    }
}
export function decodeContentFilterElementResult(inp) {
    let obj = new ContentFilterElementResult();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ContentFilterElementResult", ContentFilterElementResult, makeExpandedNodeId(606, 0));
//# sourceMappingURL=ContentFilterElementResult.js.map