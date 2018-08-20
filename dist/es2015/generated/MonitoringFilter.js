/**

*/
export class MonitoringFilter {
    constructor() { }
    ;
    clone(target) {
        if (!target) {
            target = new MonitoringFilter();
        }
        return target;
    }
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("MonitoringFilter", MonitoringFilter, makeExpandedNodeId(721, 0));
//# sourceMappingURL=MonitoringFilter.js.map