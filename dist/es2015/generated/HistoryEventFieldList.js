import { decodeVariant } from '../variant';
import * as ec from '../basic-types';
/**

*/
export class HistoryEventFieldList {
    constructor(options) {
        options = options || {};
        this.eventFields = (options.eventFields) ? options.eventFields : [];
    }
    encode(out) {
        ec.encodeArray(this.eventFields, out);
    }
    decode(inp) {
        this.eventFields = ec.decodeArray(inp, decodeVariant);
    }
    clone(target) {
        if (!target) {
            target = new HistoryEventFieldList();
        }
        if (this.eventFields) {
            target.eventFields = ec.cloneComplexArray(this.eventFields);
        }
        return target;
    }
}
export function decodeHistoryEventFieldList(inp) {
    let obj = new HistoryEventFieldList();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("HistoryEventFieldList", HistoryEventFieldList, makeExpandedNodeId(922, 0));
//# sourceMappingURL=HistoryEventFieldList.js.map