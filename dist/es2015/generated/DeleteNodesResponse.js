import { ResponseHeader } from './ResponseHeader';
import * as ec from '../basic-types';
import { decodeDiagnosticInfo } from './DiagnosticInfo';
/**
Delete one or more nodes from the server address space.
*/
export class DeleteNodesResponse {
    constructor(options) {
        options = options || {};
        this.responseHeader = (options.responseHeader) ? options.responseHeader : new ResponseHeader();
        this.results = (options.results) ? options.results : [];
        this.diagnosticInfos = (options.diagnosticInfos) ? options.diagnosticInfos : [];
    }
    encode(out) {
        this.responseHeader.encode(out);
        ec.encodeArray(this.results, out, ec.encodeStatusCode);
        ec.encodeArray(this.diagnosticInfos, out);
    }
    decode(inp) {
        this.responseHeader.decode(inp);
        this.results = ec.decodeArray(inp, ec.decodeStatusCode);
        this.diagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);
    }
    clone(target) {
        if (!target) {
            target = new DeleteNodesResponse();
        }
        if (this.responseHeader) {
            target.responseHeader = this.responseHeader.clone();
        }
        target.results = ec.cloneArray(this.results);
        if (this.diagnosticInfos) {
            target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos);
        }
        return target;
    }
}
export function decodeDeleteNodesResponse(inp) {
    let obj = new DeleteNodesResponse();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DeleteNodesResponse", DeleteNodesResponse, makeExpandedNodeId(503, 0));
//# sourceMappingURL=DeleteNodesResponse.js.map