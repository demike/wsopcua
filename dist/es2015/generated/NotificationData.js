/**

*/
export class NotificationData {
    constructor() { }
    ;
    clone(target) {
        if (!target) {
            target = new NotificationData();
        }
        return target;
    }
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("NotificationData", NotificationData, makeExpandedNodeId(947, 0));
//# sourceMappingURL=NotificationData.js.map