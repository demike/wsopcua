import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
import { decodeDiagnosticInfo } from './DiagnosticInfo';
/**
Activates a session with the server.
*/
export class ActivateSessionResponse {
    constructor(options) {
        options = options || {};
        this.responseHeader = (options.responseHeader) ? options.responseHeader : new ResponseHeader();
        this.serverNonce = (options.serverNonce) ? options.serverNonce : null;
        this.results = (options.results) ? options.results : [];
        this.diagnosticInfos = (options.diagnosticInfos) ? options.diagnosticInfos : [];
    }
    encode(out) {
        this.responseHeader.encode(out);
        ec.encodeByteString(this.serverNonce, out);
        ec.encodeArray(this.results, out, ec.encodeStatusCode);
        ec.encodeArray(this.diagnosticInfos, out);
    }
    decode(inp) {
        this.responseHeader.decode(inp);
        this.serverNonce = ec.decodeByteString(inp);
        this.results = ec.decodeArray(inp, ec.decodeStatusCode);
        this.diagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);
    }
    clone(target) {
        if (!target) {
            target = new ActivateSessionResponse();
        }
        if (this.responseHeader) {
            target.responseHeader = this.responseHeader.clone();
        }
        target.serverNonce = this.serverNonce;
        target.results = ec.cloneArray(this.results);
        if (this.diagnosticInfos) {
            target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos);
        }
        return target;
    }
}
export function decodeActivateSessionResponse(inp) {
    let obj = new ActivateSessionResponse();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ActivateSessionResponse", ActivateSessionResponse, makeExpandedNodeId(470, 0));
//# sourceMappingURL=ActivateSessionResponse.js.map