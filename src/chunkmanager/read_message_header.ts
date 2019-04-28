'use strict';

import {DataStream} from '../basic-types/DataStream';
export function readMessageHeader(stream: DataStream) {
    const msgType = String.fromCharCode(stream.getUint8()) +
      String.fromCharCode(stream.getUint8()) +
      String.fromCharCode(stream.getUint8());

    const isFinal = String.fromCharCode(stream.getUint8());

    const length = stream.getUint32();

    return {msgType: msgType, isFinal: isFinal, length: length};
}

