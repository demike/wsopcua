"use strict";
export function readMessageHeader(stream) {
    var msgType = String.fromCharCode(stream.getUint8()) +
        String.fromCharCode(stream.getUint8()) +
        String.fromCharCode(stream.getUint8());
    var isFinal = String.fromCharCode(stream.getUint8());
    var length = stream.getUint32();
    return { msgType: msgType, isFinal: isFinal, length: length };
}
//# sourceMappingURL=read_message_header.js.map