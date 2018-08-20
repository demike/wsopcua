import { ResponseHeader } from './ResponseHeader';
import { decodeQueryDataSet } from './QueryDataSet';
import * as ec from '../basic-types';
/**

*/
export class QueryNextResponse {
    constructor(options) {
        options = options || {};
        this.responseHeader = (options.responseHeader) ? options.responseHeader : new ResponseHeader();
        this.queryDataSets = (options.queryDataSets) ? options.queryDataSets : [];
        this.revisedContinuationPoint = (options.revisedContinuationPoint) ? options.revisedContinuationPoint : null;
    }
    encode(out) {
        this.responseHeader.encode(out);
        ec.encodeArray(this.queryDataSets, out);
        ec.encodeByteString(this.revisedContinuationPoint, out);
    }
    decode(inp) {
        this.responseHeader.decode(inp);
        this.queryDataSets = ec.decodeArray(inp, decodeQueryDataSet);
        this.revisedContinuationPoint = ec.decodeByteString(inp);
    }
    clone(target) {
        if (!target) {
            target = new QueryNextResponse();
        }
        if (this.responseHeader) {
            target.responseHeader = this.responseHeader.clone();
        }
        if (this.queryDataSets) {
            target.queryDataSets = ec.cloneComplexArray(this.queryDataSets);
        }
        target.revisedContinuationPoint = this.revisedContinuationPoint;
        return target;
    }
}
export function decodeQueryNextResponse(inp) {
    let obj = new QueryNextResponse();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("QueryNextResponse", QueryNextResponse, makeExpandedNodeId(624, 0));
//# sourceMappingURL=QueryNextResponse.js.map