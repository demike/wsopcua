import * as ec from '../basic-types';
/**
A recursive structure containing diagnostic information associated with a status code.
*/
export class DiagnosticInfo {
    constructor(options) {
        options = options || {};
        this.symbolicId = (options.symbolicId) ? options.symbolicId : null;
        this.namespaceURI = (options.namespaceURI) ? options.namespaceURI : null;
        this.locale = (options.locale) ? options.locale : null;
        this.localizedText = (options.localizedText) ? options.localizedText : null;
        this.additionalInfo = (options.additionalInfo) ? options.additionalInfo : null;
        this.innerStatusCode = (options.innerStatusCode) ? options.innerStatusCode : null;
        this.innerDiagnosticInfo = (options.innerDiagnosticInfo) ? options.innerDiagnosticInfo : null;
    }
    encode(out) {
        let encodingByte = 0;
        if (this.symbolicId != null) {
            encodingByte |= 1 << 0;
        }
        if (this.namespaceURI != null) {
            encodingByte |= 1 << 1;
        }
        if (this.locale != null) {
            encodingByte |= 1 << 2;
        }
        if (this.localizedText != null) {
            encodingByte |= 1 << 3;
        }
        if (this.additionalInfo != null) {
            encodingByte |= 1 << 4;
        }
        if (this.innerStatusCode != null) {
            encodingByte |= 1 << 5;
        }
        if (this.innerDiagnosticInfo != null) {
            encodingByte |= 1 << 6;
        }
        out.setUint8(encodingByte);
        if (this.symbolicId != null) {
            ec.encodeInt32(this.symbolicId, out);
        }
        if (this.namespaceURI != null) {
            ec.encodeInt32(this.namespaceURI, out);
        }
        if (this.locale != null) {
            ec.encodeInt32(this.locale, out);
        }
        if (this.localizedText != null) {
            ec.encodeInt32(this.localizedText, out);
        }
        if (this.additionalInfo != null) {
            ec.encodeString(this.additionalInfo, out);
        }
        if (this.innerStatusCode != null) {
            ec.encodeStatusCode(this.innerStatusCode, out);
        }
        if (this.innerDiagnosticInfo != null) {
            this.innerDiagnosticInfo.encode(out);
        }
    }
    decode(inp) {
        let encodingByte = inp.getUint8();
        let symbolicIdSpecified = (encodingByte & 1) != 0;
        let namespaceURISpecified = (encodingByte & 2) != 0;
        let localeSpecified = (encodingByte & 4) != 0;
        let localizedTextSpecified = (encodingByte & 8) != 0;
        let additionalInfoSpecified = (encodingByte & 16) != 0;
        let innerStatusCodeSpecified = (encodingByte & 32) != 0;
        let innerDiagnosticInfoSpecified = (encodingByte & 64) != 0;
        let reserved1 = (encodingByte & 128) != 0;
        if (symbolicIdSpecified) {
            this.symbolicId = ec.decodeInt32(inp);
        }
        if (namespaceURISpecified) {
            this.namespaceURI = ec.decodeInt32(inp);
        }
        if (localeSpecified) {
            this.locale = ec.decodeInt32(inp);
        }
        if (localizedTextSpecified) {
            this.localizedText = ec.decodeInt32(inp);
        }
        if (additionalInfoSpecified) {
            this.additionalInfo = ec.decodeString(inp);
        }
        if (innerStatusCodeSpecified) {
            this.innerStatusCode = ec.decodeStatusCode(inp);
        }
        if (innerDiagnosticInfoSpecified) {
            this.innerDiagnosticInfo = new DiagnosticInfo();
            this.innerDiagnosticInfo.decode(inp);
        }
    }
    clone(target) {
        if (!target) {
            target = new DiagnosticInfo();
        }
        target.symbolicId = this.symbolicId;
        target.namespaceURI = this.namespaceURI;
        target.locale = this.locale;
        target.localizedText = this.localizedText;
        target.additionalInfo = this.additionalInfo;
        target.innerStatusCode = this.innerStatusCode;
        if (this.innerDiagnosticInfo) {
            target.innerDiagnosticInfo = this.innerDiagnosticInfo.clone();
        }
        return target;
    }
}
export function decodeDiagnosticInfo(inp) {
    let obj = new DiagnosticInfo();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DiagnosticInfo", DiagnosticInfo, makeExpandedNodeId(25, 0));
//# sourceMappingURL=DiagnosticInfo.js.map