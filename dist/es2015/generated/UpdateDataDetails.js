import { encodePerformUpdateType, decodePerformUpdateType } from './PerformUpdateType';
import { decodeDataValue } from './DataValue';
import * as ec from '../basic-types';
import { HistoryUpdateDetails } from './HistoryUpdateDetails';
/**

*/
export class UpdateDataDetails extends HistoryUpdateDetails {
    constructor(options) {
        options = options || {};
        super(options);
        this.performInsertReplace = (options.performInsertReplace) ? options.performInsertReplace : null;
        this.updateValues = (options.updateValues) ? options.updateValues : [];
    }
    encode(out) {
        super.encode(out);
        encodePerformUpdateType(this.performInsertReplace, out);
        ec.encodeArray(this.updateValues, out);
    }
    decode(inp) {
        super.decode(inp);
        this.performInsertReplace = decodePerformUpdateType(inp);
        this.updateValues = ec.decodeArray(inp, decodeDataValue);
    }
    clone(target) {
        if (!target) {
            target = new UpdateDataDetails();
        }
        super.clone(target);
        target.performInsertReplace = this.performInsertReplace;
        if (this.updateValues) {
            target.updateValues = ec.cloneComplexArray(this.updateValues);
        }
        return target;
    }
}
export function decodeUpdateDataDetails(inp) {
    let obj = new UpdateDataDetails();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("UpdateDataDetails", UpdateDataDetails, makeExpandedNodeId(682, 0));
//# sourceMappingURL=UpdateDataDetails.js.map