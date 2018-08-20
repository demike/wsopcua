import * as ec from '../basic-types';
/**

*/
export class EndpointUrlListDataType {
    constructor(options) {
        options = options || {};
        this.endpointUrlList = (options.endpointUrlList) ? options.endpointUrlList : [];
    }
    encode(out) {
        ec.encodeArray(this.endpointUrlList, out, ec.encodeString);
    }
    decode(inp) {
        this.endpointUrlList = ec.decodeArray(inp, ec.decodeString);
    }
    clone(target) {
        if (!target) {
            target = new EndpointUrlListDataType();
        }
        target.endpointUrlList = ec.cloneArray(this.endpointUrlList);
        return target;
    }
}
export function decodeEndpointUrlListDataType(inp) {
    let obj = new EndpointUrlListDataType();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("EndpointUrlListDataType", EndpointUrlListDataType, makeExpandedNodeId(11957, 0));
//# sourceMappingURL=EndpointUrlListDataType.js.map