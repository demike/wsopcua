"use strict";
import { hexDump } from '../common/debug';
export function buffer_ellipsis(buffer, start, end) {
    start = start || 0;
    end = end || buffer.byteLength;
    if (end - start < 40) {
        return hexDump(buffer, start, end - start);
    }
    return hexDump(buffer, start, 10) + " ... " + hexDump(buffer, end - 10, 10);
}
//# sourceMappingURL=buffer_ellipsis.js.map