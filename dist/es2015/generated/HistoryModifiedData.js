import * as ec from '../basic-types';
import { decodeModificationInfo } from './ModificationInfo';
import { HistoryData } from './HistoryData';
/**

*/
export class HistoryModifiedData extends HistoryData {
    constructor(options) {
        options = options || {};
        super(options);
        this.noOfDataValues = (options.noOfDataValues) ? options.noOfDataValues : null;
        this.modificationInfos = (options.modificationInfos) ? options.modificationInfos : [];
    }
    encode(out) {
        super.encode(out);
        ec.encodeInt32(this.noOfDataValues, out);
        ec.encodeArray(this.modificationInfos, out);
    }
    decode(inp) {
        super.decode(inp);
        this.noOfDataValues = ec.decodeInt32(inp);
        this.modificationInfos = ec.decodeArray(inp, decodeModificationInfo);
    }
    clone(target) {
        if (!target) {
            target = new HistoryModifiedData();
        }
        super.clone(target);
        target.noOfDataValues = this.noOfDataValues;
        if (this.modificationInfos) {
            target.modificationInfos = ec.cloneComplexArray(this.modificationInfos);
        }
        return target;
    }
}
export function decodeHistoryModifiedData(inp) {
    let obj = new HistoryModifiedData();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("HistoryModifiedData", HistoryModifiedData, makeExpandedNodeId(11227, 0));
//# sourceMappingURL=HistoryModifiedData.js.map