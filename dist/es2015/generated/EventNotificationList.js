import { decodeEventFieldList } from './EventFieldList';
import * as ec from '../basic-types';
import { NotificationData } from './NotificationData';
/**

*/
export class EventNotificationList extends NotificationData {
    constructor(options) {
        options = options || {};
        super();
        this.events = (options.events) ? options.events : [];
    }
    encode(out) {
        ec.encodeArray(this.events, out);
    }
    decode(inp) {
        this.events = ec.decodeArray(inp, decodeEventFieldList);
    }
    clone(target) {
        if (!target) {
            target = new EventNotificationList();
        }
        if (this.events) {
            target.events = ec.cloneComplexArray(this.events);
        }
        return target;
    }
}
export function decodeEventNotificationList(inp) {
    let obj = new EventNotificationList();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("EventNotificationList", EventNotificationList, makeExpandedNodeId(916, 0));
//# sourceMappingURL=EventNotificationList.js.map