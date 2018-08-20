import { decodeContentFilterElementResult } from './ContentFilterElementResult';
import { decodeDiagnosticInfo } from './DiagnosticInfo';
import * as ec from '../basic-types';
/**

*/
export class ContentFilterResult {
    constructor(options) {
        options = options || {};
        this.elementResults = (options.elementResults) ? options.elementResults : [];
        this.elementDiagnosticInfos = (options.elementDiagnosticInfos) ? options.elementDiagnosticInfos : [];
    }
    encode(out) {
        ec.encodeArray(this.elementResults, out);
        ec.encodeArray(this.elementDiagnosticInfos, out);
    }
    decode(inp) {
        this.elementResults = ec.decodeArray(inp, decodeContentFilterElementResult);
        this.elementDiagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);
    }
    clone(target) {
        if (!target) {
            target = new ContentFilterResult();
        }
        if (this.elementResults) {
            target.elementResults = ec.cloneComplexArray(this.elementResults);
        }
        if (this.elementDiagnosticInfos) {
            target.elementDiagnosticInfos = ec.cloneComplexArray(this.elementDiagnosticInfos);
        }
        return target;
    }
}
export function decodeContentFilterResult(inp) {
    let obj = new ContentFilterResult();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ContentFilterResult", ContentFilterResult, makeExpandedNodeId(609, 0));
//# sourceMappingURL=ContentFilterResult.js.map