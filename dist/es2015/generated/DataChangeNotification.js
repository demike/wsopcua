import { decodeMonitoredItemNotification } from './MonitoredItemNotification';
import { decodeDiagnosticInfo } from './DiagnosticInfo';
import * as ec from '../basic-types';
import { NotificationData } from './NotificationData';
/**

*/
export class DataChangeNotification extends NotificationData {
    constructor(options) {
        options = options || {};
        super();
        this.monitoredItems = (options.monitoredItems) ? options.monitoredItems : [];
        this.diagnosticInfos = (options.diagnosticInfos) ? options.diagnosticInfos : [];
    }
    encode(out) {
        ec.encodeArray(this.monitoredItems, out);
        ec.encodeArray(this.diagnosticInfos, out);
    }
    decode(inp) {
        this.monitoredItems = ec.decodeArray(inp, decodeMonitoredItemNotification);
        this.diagnosticInfos = ec.decodeArray(inp, decodeDiagnosticInfo);
    }
    clone(target) {
        if (!target) {
            target = new DataChangeNotification();
        }
        if (this.monitoredItems) {
            target.monitoredItems = ec.cloneComplexArray(this.monitoredItems);
        }
        if (this.diagnosticInfos) {
            target.diagnosticInfos = ec.cloneComplexArray(this.diagnosticInfos);
        }
        return target;
    }
}
export function decodeDataChangeNotification(inp) {
    let obj = new DataChangeNotification();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DataChangeNotification", DataChangeNotification, makeExpandedNodeId(811, 0));
//# sourceMappingURL=DataChangeNotification.js.map