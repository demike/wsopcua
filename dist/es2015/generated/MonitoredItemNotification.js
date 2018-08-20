import * as ec from '../basic-types';
import { DataValue } from './DataValue';
/**

*/
export class MonitoredItemNotification {
    constructor(options) {
        options = options || {};
        this.clientHandle = (options.clientHandle) ? options.clientHandle : null;
        this.value = (options.value) ? options.value : new DataValue();
    }
    encode(out) {
        ec.encodeUInt32(this.clientHandle, out);
        this.value.encode(out);
    }
    decode(inp) {
        this.clientHandle = ec.decodeUInt32(inp);
        this.value.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new MonitoredItemNotification();
        }
        target.clientHandle = this.clientHandle;
        if (this.value) {
            target.value = this.value.clone();
        }
        return target;
    }
}
export function decodeMonitoredItemNotification(inp) {
    let obj = new MonitoredItemNotification();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("MonitoredItemNotification", MonitoredItemNotification, makeExpandedNodeId(808, 0));
//# sourceMappingURL=MonitoredItemNotification.js.map