/**

*/
export class MonitoringFilterResult {
    constructor() { }
    ;
    clone(target) {
        if (!target) {
            target = new MonitoringFilterResult();
        }
        return target;
    }
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("MonitoringFilterResult", MonitoringFilterResult, makeExpandedNodeId(733, 0));
//# sourceMappingURL=MonitoringFilterResult.js.map