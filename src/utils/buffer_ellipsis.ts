'use strict';

import {hexDump} from '../common/debug';

export function buffer_ellipsis(buffer: ArrayBuffer, start?: number, end?: number) {
    start = start || 0;
    end = end || buffer.byteLength;
    if (end - start < 40) {
        return hexDump(buffer, start, end - start);
    }
    return hexDump(buffer, start, 10) + ' ... ' + hexDump(buffer, end - 10, 10);
}
