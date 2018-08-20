import { ResponseHeader } from './ResponseHeader';
import { decodeBrowsePathResult } from './BrowsePathResult';
import { decodeDiagnosticInfo } from './DiagnosticInfo';
import * as ec from '../basic-types';
/**
Translates one or more paths in the server address space.
*/
export class TranslateBrowsePathsToNodeIdsResponse {
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
        this.results = ec.decodeArray(inp, decodeBrowsePathResult);
        this.diagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);
    }
    clone(target) {
        if (!target) {
            target = new TranslateBrowsePathsToNodeIdsResponse();
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
export function decodeTranslateBrowsePathsToNodeIdsResponse(inp) {
    let obj = new TranslateBrowsePathsToNodeIdsResponse();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("TranslateBrowsePathsToNodeIdsResponse", TranslateBrowsePathsToNodeIdsResponse, makeExpandedNodeId(557, 0));
//# sourceMappingURL=TranslateBrowsePathsToNodeIdsResponse.js.map