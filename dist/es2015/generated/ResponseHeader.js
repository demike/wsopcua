import * as ec from '../basic-types';
import { DiagnosticInfo } from './DiagnosticInfo';
/**
The header passed with every server response.
*/
export class ResponseHeader {
    constructor(options) {
        options = options || {};
        this.timestamp = (options.timestamp) ? options.timestamp : null;
        this.requestHandle = (options.requestHandle) ? options.requestHandle : null;
        this.serviceResult = (options.serviceResult) ? options.serviceResult : null;
        this.serviceDiagnostics = (options.serviceDiagnostics) ? options.serviceDiagnostics : new DiagnosticInfo();
        this.stringTable = (options.stringTable) ? options.stringTable : [];
        this.additionalHeader = (options.additionalHeader) ? options.additionalHeader : null;
    }
    encode(out) {
        ec.encodeDateTime(this.timestamp, out);
        ec.encodeUInt32(this.requestHandle, out);
        ec.encodeStatusCode(this.serviceResult, out);
        this.serviceDiagnostics.encode(out);
        ec.encodeArray(this.stringTable, out, ec.encodeString);
        ec.encodeExtensionObject(this.additionalHeader, out);
    }
    decode(inp) {
        this.timestamp = ec.decodeDateTime(inp);
        this.requestHandle = ec.decodeUInt32(inp);
        this.serviceResult = ec.decodeStatusCode(inp);
        this.serviceDiagnostics.decode(inp);
        this.stringTable = ec.decodeArray(inp, ec.decodeString);
        this.additionalHeader = ec.decodeExtensionObject(inp);
    }
    clone(target) {
        if (!target) {
            target = new ResponseHeader();
        }
        target.timestamp = this.timestamp;
        target.requestHandle = this.requestHandle;
        target.serviceResult = this.serviceResult;
        if (this.serviceDiagnostics) {
            target.serviceDiagnostics = this.serviceDiagnostics.clone();
        }
        target.stringTable = ec.cloneArray(this.stringTable);
        target.additionalHeader = this.additionalHeader;
        return target;
    }
}
export function decodeResponseHeader(inp) {
    let obj = new ResponseHeader();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ResponseHeader", ResponseHeader, makeExpandedNodeId(394, 0));
//# sourceMappingURL=ResponseHeader.js.map