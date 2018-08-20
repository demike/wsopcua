import { decodeHistoryEventFieldList } from './HistoryEventFieldList';
import * as ec from '../basic-types';
/**

*/
export class HistoryEvent {
    constructor(options) {
        options = options || {};
        this.events = (options.events) ? options.events : [];
    }
    encode(out) {
        ec.encodeArray(this.events, out);
    }
    decode(inp) {
        this.events = ec.decodeArray(inp, decodeHistoryEventFieldList);
    }
    clone(target) {
        if (!target) {
            target = new HistoryEvent();
        }
        if (this.events) {
            target.events = ec.cloneComplexArray(this.events);
        }
        return target;
    }
}
export function decodeHistoryEvent(inp) {
    let obj = new HistoryEvent();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("HistoryEvent", HistoryEvent, makeExpandedNodeId(661, 0));
//# sourceMappingURL=HistoryEvent.js.map