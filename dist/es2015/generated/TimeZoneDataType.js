import * as ec from '../basic-types';
/**

*/
export class TimeZoneDataType {
    constructor(options) {
        options = options || {};
        this.offset = (options.offset) ? options.offset : null;
        this.daylightSavingInOffset = (options.daylightSavingInOffset) ? options.daylightSavingInOffset : null;
    }
    encode(out) {
        ec.encodeInt16(this.offset, out);
        ec.encodeBoolean(this.daylightSavingInOffset, out);
    }
    decode(inp) {
        this.offset = ec.decodeInt16(inp);
        this.daylightSavingInOffset = ec.decodeBoolean(inp);
    }
    clone(target) {
        if (!target) {
            target = new TimeZoneDataType();
        }
        target.offset = this.offset;
        target.daylightSavingInOffset = this.daylightSavingInOffset;
        return target;
    }
}
export function decodeTimeZoneDataType(inp) {
    let obj = new TimeZoneDataType();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("TimeZoneDataType", TimeZoneDataType, makeExpandedNodeId(8917, 0));
//# sourceMappingURL=TimeZoneDataType.js.map