import { decodeDataValue } from './DataValue';
import * as ec from '../basic-types';
/**

*/
export class HistoryData {
    constructor(options) {
        options = options || {};
        this.dataValues = (options.dataValues) ? options.dataValues : [];
    }
    encode(out) {
        ec.encodeArray(this.dataValues, out);
    }
    decode(inp) {
        this.dataValues = ec.decodeArray(inp, decodeDataValue);
    }
    clone(target) {
        if (!target) {
            target = new HistoryData();
        }
        if (this.dataValues) {
            target.dataValues = ec.cloneComplexArray(this.dataValues);
        }
        return target;
    }
}
export function decodeHistoryData(inp) {
    let obj = new HistoryData();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("HistoryData", HistoryData, makeExpandedNodeId(658, 0));
//# sourceMappingURL=HistoryData.js.map