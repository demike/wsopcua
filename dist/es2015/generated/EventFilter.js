import { decodeSimpleAttributeOperand } from './SimpleAttributeOperand';
import { ContentFilter } from './ContentFilter';
import * as ec from '../basic-types';
import { MonitoringFilter } from './MonitoringFilter';
/**

*/
export class EventFilter extends MonitoringFilter {
    constructor(options) {
        options = options || {};
        super();
        this.selectClauses = (options.selectClauses) ? options.selectClauses : [];
        this.whereClause = (options.whereClause) ? options.whereClause : new ContentFilter();
    }
    encode(out) {
        ec.encodeArray(this.selectClauses, out);
        this.whereClause.encode(out);
    }
    decode(inp) {
        this.selectClauses = ec.decodeArray(inp, decodeSimpleAttributeOperand);
        this.whereClause.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new EventFilter();
        }
        if (this.selectClauses) {
            target.selectClauses = ec.cloneComplexArray(this.selectClauses);
        }
        if (this.whereClause) {
            target.whereClause = this.whereClause.clone();
        }
        return target;
    }
}
export function decodeEventFilter(inp) {
    let obj = new EventFilter();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("EventFilter", EventFilter, makeExpandedNodeId(727, 0));
//# sourceMappingURL=EventFilter.js.map