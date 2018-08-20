import * as ec from '../basic-types';
import { DiagnosticInfo } from './DiagnosticInfo';
import { NotificationData } from './NotificationData';
/**

*/
export class StatusChangeNotification extends NotificationData {
    constructor(options) {
        options = options || {};
        super();
        this.status = (options.status) ? options.status : null;
        this.diagnosticInfo = (options.diagnosticInfo) ? options.diagnosticInfo : new DiagnosticInfo();
    }
    encode(out) {
        ec.encodeStatusCode(this.status, out);
        this.diagnosticInfo.encode(out);
    }
    decode(inp) {
        this.status = ec.decodeStatusCode(inp);
        this.diagnosticInfo.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new StatusChangeNotification();
        }
        target.status = this.status;
        if (this.diagnosticInfo) {
            target.diagnosticInfo = this.diagnosticInfo.clone();
        }
        return target;
    }
}
export function decodeStatusChangeNotification(inp) {
    let obj = new StatusChangeNotification();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("StatusChangeNotification", StatusChangeNotification, makeExpandedNodeId(820, 0));
//# sourceMappingURL=StatusChangeNotification.js.map