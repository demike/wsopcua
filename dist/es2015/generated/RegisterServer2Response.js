import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
import { decodeDiagnosticInfo } from './DiagnosticInfo';
/**

*/
export class RegisterServer2Response {
    constructor(options) {
        options = options || {};
        this.responseHeader = (options.responseHeader) ? options.responseHeader : new ResponseHeader();
        this.configurationResults = (options.configurationResults) ? options.configurationResults : [];
        this.diagnosticInfos = (options.diagnosticInfos) ? options.diagnosticInfos : [];
    }
    encode(out) {
        this.responseHeader.encode(out);
        ec.encodeArray(this.configurationResults, out, ec.encodeStatusCode);
        ec.encodeArray(this.diagnosticInfos, out);
    }
    decode(inp) {
        this.responseHeader.decode(inp);
        this.configurationResults = ec.decodeArray(inp, ec.decodeStatusCode);
        this.diagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);
    }
    clone(target) {
        if (!target) {
            target = new RegisterServer2Response();
        }
        if (this.responseHeader) {
            target.responseHeader = this.responseHeader.clone();
        }
        target.configurationResults = ec.cloneArray(this.configurationResults);
        if (this.diagnosticInfos) {
            target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos);
        }
        return target;
    }
}
export function decodeRegisterServer2Response(inp) {
    let obj = new RegisterServer2Response();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("RegisterServer2Response", RegisterServer2Response, makeExpandedNodeId(12212, 0));
//# sourceMappingURL=RegisterServer2Response.js.map