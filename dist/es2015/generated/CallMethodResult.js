import * as ec from '../basic-types';
import { decodeDiagnosticInfo } from './DiagnosticInfo';
import { decodeVariant } from '../variant';
/**

*/
export class CallMethodResult {
    constructor(options) {
        options = options || {};
        this.statusCode = (options.statusCode) ? options.statusCode : null;
        this.inputArgumentResults = (options.inputArgumentResults) ? options.inputArgumentResults : [];
        this.inputArgumentDiagnosticInfos = (options.inputArgumentDiagnosticInfos) ? options.inputArgumentDiagnosticInfos : [];
        this.outputArguments = (options.outputArguments) ? options.outputArguments : [];
    }
    encode(out) {
        ec.encodeStatusCode(this.statusCode, out);
        ec.encodeArray(this.inputArgumentResults, out, ec.encodeStatusCode);
        ec.encodeArray(this.inputArgumentDiagnosticInfos, out);
        ec.encodeArray(this.outputArguments, out);
    }
    decode(inp) {
        this.statusCode = ec.decodeStatusCode(inp);
        this.inputArgumentResults = ec.decodeArray(inp, ec.decodeStatusCode);
        this.inputArgumentDiagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);
        this.outputArguments = ec.decodeArray(inp, decodeVariant);
    }
    clone(target) {
        if (!target) {
            target = new CallMethodResult();
        }
        target.statusCode = this.statusCode;
        target.inputArgumentResults = ec.cloneArray(this.inputArgumentResults);
        if (this.inputArgumentDiagnosticInfos) {
            target.inputArgumentDiagnosticInfos = ec.cloneComplexArray(this.inputArgumentDiagnosticInfos);
        }
        if (this.outputArguments) {
            target.outputArguments = ec.cloneComplexArray(this.outputArguments);
        }
        return target;
    }
}
export function decodeCallMethodResult(inp) {
    let obj = new CallMethodResult();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("CallMethodResult", CallMethodResult, makeExpandedNodeId(709, 0));
//# sourceMappingURL=CallMethodResult.js.map