/**

*/
export class FilterOperand {
    constructor() { }
    ;
    clone(target) {
        if (!target) {
            target = new FilterOperand();
        }
        return target;
    }
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("FilterOperand", FilterOperand, makeExpandedNodeId(591, 0));
//# sourceMappingURL=FilterOperand.js.map