"use strict";

import {DataStream} from '../basic-types/DataStream';
export function readMessageHeader(stream : DataStream) {
    var msgType = String.fromCharCode(stream.getUint8()) +
      String.fromCharCode(stream.getUint8()) +
      String.fromCharCode(stream.getUint8());

    var isFinal = String.fromCharCode(stream.getUint8());

    var length = stream.getUint32();

    return {msgType: msgType, isFinal: isFinal, length: length};
}

