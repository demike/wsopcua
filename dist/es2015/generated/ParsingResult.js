import * as ec from '../basic-types';
import { decodeDiagnosticInfo } from './DiagnosticInfo';
/**

*/
export class ParsingResult {
    constructor(options) {
        options = options || {};
        this.statusCode = (options.statusCode) ? options.statusCode : null;
        this.dataStatusCodes = (options.dataStatusCodes) ? options.dataStatusCodes : [];
        this.dataDiagnosticInfos = (options.dataDiagnosticInfos) ? options.dataDiagnosticInfos : [];
    }
    encode(out) {
        ec.encodeStatusCode(this.statusCode, out);
        ec.encodeArray(this.dataStatusCodes, out, ec.encodeStatusCode);
        ec.encodeArray(this.dataDiagnosticInfos, out);
    }
    decode(inp) {
        this.statusCode = ec.decodeStatusCode(inp);
        this.dataStatusCodes = ec.decodeArray(inp, ec.decodeStatusCode);
        this.dataDiagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);
    }
    clone(target) {
        if (!target) {
            target = new ParsingResult();
        }
        target.statusCode = this.statusCode;
        target.dataStatusCodes = ec.cloneArray(this.dataStatusCodes);
        if (this.dataDiagnosticInfos) {
            target.dataDiagnosticInfos = ec.cloneComplexArray(this.dataDiagnosticInfos);
        }
        return target;
    }
}
export function decodeParsingResult(inp) {
    let obj = new ParsingResult();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ParsingResult", ParsingResult, makeExpandedNodeId(612, 0));
//# sourceMappingURL=ParsingResult.js.map