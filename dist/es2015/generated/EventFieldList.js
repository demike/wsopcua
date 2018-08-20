import * as ec from '../basic-types';
import { decodeVariant } from '../variant';
/**

*/
export class EventFieldList {
    constructor(options) {
        options = options || {};
        this.clientHandle = (options.clientHandle) ? options.clientHandle : null;
        this.eventFields = (options.eventFields) ? options.eventFields : [];
    }
    encode(out) {
        ec.encodeUInt32(this.clientHandle, out);
        ec.encodeArray(this.eventFields, out);
    }
    decode(inp) {
        this.clientHandle = ec.decodeUInt32(inp);
        this.eventFields = ec.decodeArray(inp, decodeVariant);
    }
    clone(target) {
        if (!target) {
            target = new EventFieldList();
        }
        target.clientHandle = this.clientHandle;
        if (this.eventFields) {
            target.eventFields = ec.cloneComplexArray(this.eventFields);
        }
        return target;
    }
}
export function decodeEventFieldList(inp) {
    let obj = new EventFieldList();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("EventFieldList", EventFieldList, makeExpandedNodeId(919, 0));
//# sourceMappingURL=EventFieldList.js.map