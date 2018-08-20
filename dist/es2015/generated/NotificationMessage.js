import * as ec from '../basic-types';
/**

*/
export class NotificationMessage {
    constructor(options) {
        options = options || {};
        this.sequenceNumber = (options.sequenceNumber) ? options.sequenceNumber : null;
        this.publishTime = (options.publishTime) ? options.publishTime : null;
        this.notificationData = (options.notificationData) ? options.notificationData : [];
    }
    encode(out) {
        ec.encodeUInt32(this.sequenceNumber, out);
        ec.encodeDateTime(this.publishTime, out);
        ec.encodeArray(this.notificationData, out, ec.encodeExtensionObject);
    }
    decode(inp) {
        this.sequenceNumber = ec.decodeUInt32(inp);
        this.publishTime = ec.decodeDateTime(inp);
        this.notificationData = ec.decodeArray(inp, ec.decodeExtensionObject);
    }
    clone(target) {
        if (!target) {
            target = new NotificationMessage();
        }
        target.sequenceNumber = this.sequenceNumber;
        target.publishTime = this.publishTime;
        target.notificationData = ec.cloneArray(this.notificationData);
        return target;
    }
}
export function decodeNotificationMessage(inp) {
    let obj = new NotificationMessage();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("NotificationMessage", NotificationMessage, makeExpandedNodeId(805, 0));
//# sourceMappingURL=NotificationMessage.js.map