import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
import { decodeDiagnosticInfo } from './DiagnosticInfo';
/**

*/
export class SetTriggeringResponse {
    constructor(options) {
        options = options || {};
        this.responseHeader = (options.responseHeader) ? options.responseHeader : new ResponseHeader();
        this.addResults = (options.addResults) ? options.addResults : [];
        this.addDiagnosticInfos = (options.addDiagnosticInfos) ? options.addDiagnosticInfos : [];
        this.removeResults = (options.removeResults) ? options.removeResults : [];
        this.removeDiagnosticInfos = (options.removeDiagnosticInfos) ? options.removeDiagnosticInfos : [];
    }
    encode(out) {
        this.responseHeader.encode(out);
        ec.encodeArray(this.addResults, out, ec.encodeStatusCode);
        ec.encodeArray(this.addDiagnosticInfos, out);
        ec.encodeArray(this.removeResults, out, ec.encodeStatusCode);
        ec.encodeArray(this.removeDiagnosticInfos, out);
    }
    decode(inp) {
        this.responseHeader.decode(inp);
        this.addResults = ec.decodeArray(inp, ec.decodeStatusCode);
        this.addDiagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);
        this.removeResults = ec.decodeArray(inp, ec.decodeStatusCode);
        this.removeDiagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);
    }
    clone(target) {
        if (!target) {
            target = new SetTriggeringResponse();
        }
        if (this.responseHeader) {
            target.responseHeader = this.responseHeader.clone();
        }
        target.addResults = ec.cloneArray(this.addResults);
        if (this.addDiagnosticInfos) {
            target.addDiagnosticInfos = ec.cloneComplexArray(this.addDiagnosticInfos);
        }
        target.removeResults = ec.cloneArray(this.removeResults);
        if (this.removeDiagnosticInfos) {
            target.removeDiagnosticInfos = ec.cloneComplexArray(this.removeDiagnosticInfos);
        }
        return target;
    }
}
export function decodeSetTriggeringResponse(inp) {
    let obj = new SetTriggeringResponse();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("SetTriggeringResponse", SetTriggeringResponse, makeExpandedNodeId(778, 0));
//# sourceMappingURL=SetTriggeringResponse.js.map