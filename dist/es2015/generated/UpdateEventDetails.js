import { encodePerformUpdateType, decodePerformUpdateType } from './PerformUpdateType';
import { EventFilter } from './EventFilter';
import { decodeHistoryEventFieldList } from './HistoryEventFieldList';
import * as ec from '../basic-types';
import { HistoryUpdateDetails } from './HistoryUpdateDetails';
/**

*/
export class UpdateEventDetails extends HistoryUpdateDetails {
    constructor(options) {
        options = options || {};
        super(options);
        this.performInsertReplace = (options.performInsertReplace) ? options.performInsertReplace : null;
        this.filter = (options.filter) ? options.filter : new EventFilter();
        this.eventData = (options.eventData) ? options.eventData : [];
    }
    encode(out) {
        super.encode(out);
        encodePerformUpdateType(this.performInsertReplace, out);
        this.filter.encode(out);
        ec.encodeArray(this.eventData, out);
    }
    decode(inp) {
        super.decode(inp);
        this.performInsertReplace = decodePerformUpdateType(inp);
        this.filter.decode(inp);
        this.eventData = ec.decodeArray(inp, decodeHistoryEventFieldList);
    }
    clone(target) {
        if (!target) {
            target = new UpdateEventDetails();
        }
        super.clone(target);
        target.performInsertReplace = this.performInsertReplace;
        if (this.filter) {
            target.filter = this.filter.clone();
        }
        if (this.eventData) {
            target.eventData = ec.cloneComplexArray(this.eventData);
        }
        return target;
    }
}
export function decodeUpdateEventDetails(inp) {
    let obj = new UpdateEventDetails();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("UpdateEventDetails", UpdateEventDetails, makeExpandedNodeId(685, 0));
//# sourceMappingURL=UpdateEventDetails.js.map