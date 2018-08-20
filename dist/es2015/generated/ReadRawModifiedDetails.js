import * as ec from '../basic-types';
import { HistoryReadDetails } from './HistoryReadDetails';
/**

*/
export class ReadRawModifiedDetails extends HistoryReadDetails {
    constructor(options) {
        options = options || {};
        super();
        this.isReadModified = (options.isReadModified) ? options.isReadModified : null;
        this.startTime = (options.startTime) ? options.startTime : null;
        this.endTime = (options.endTime) ? options.endTime : null;
        this.numValuesPerNode = (options.numValuesPerNode) ? options.numValuesPerNode : null;
        this.returnBounds = (options.returnBounds) ? options.returnBounds : null;
    }
    encode(out) {
        ec.encodeBoolean(this.isReadModified, out);
        ec.encodeDateTime(this.startTime, out);
        ec.encodeDateTime(this.endTime, out);
        ec.encodeUInt32(this.numValuesPerNode, out);
        ec.encodeBoolean(this.returnBounds, out);
    }
    decode(inp) {
        this.isReadModified = ec.decodeBoolean(inp);
        this.startTime = ec.decodeDateTime(inp);
        this.endTime = ec.decodeDateTime(inp);
        this.numValuesPerNode = ec.decodeUInt32(inp);
        this.returnBounds = ec.decodeBoolean(inp);
    }
    clone(target) {
        if (!target) {
            target = new ReadRawModifiedDetails();
        }
        target.isReadModified = this.isReadModified;
        target.startTime = this.startTime;
        target.endTime = this.endTime;
        target.numValuesPerNode = this.numValuesPerNode;
        target.returnBounds = this.returnBounds;
        return target;
    }
}
export function decodeReadRawModifiedDetails(inp) {
    let obj = new ReadRawModifiedDetails();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ReadRawModifiedDetails", ReadRawModifiedDetails, makeExpandedNodeId(649, 0));
//# sourceMappingURL=ReadRawModifiedDetails.js.map