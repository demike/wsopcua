import { ResponseHeader } from './ResponseHeader';
import { decodeEndpointDescription } from './EndpointDescription';
import * as ec from '../basic-types';
/**
Gets the endpoints used by the server.
*/
export class GetEndpointsResponse {
    constructor(options) {
        options = options || {};
        this.responseHeader = (options.responseHeader) ? options.responseHeader : new ResponseHeader();
        this.endpoints = (options.endpoints) ? options.endpoints : [];
    }
    encode(out) {
        this.responseHeader.encode(out);
        ec.encodeArray(this.endpoints, out);
    }
    decode(inp) {
        this.responseHeader.decode(inp);
        this.endpoints = ec.decodeArray(inp, decodeEndpointDescription);
    }
    clone(target) {
        if (!target) {
            target = new GetEndpointsResponse();
        }
        if (this.responseHeader) {
            target.responseHeader = this.responseHeader.clone();
        }
        if (this.endpoints) {
            target.endpoints = ec.cloneComplexArray(this.endpoints);
        }
        return target;
    }
}
export function decodeGetEndpointsResponse(inp) {
    let obj = new GetEndpointsResponse();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("GetEndpointsResponse", GetEndpointsResponse, makeExpandedNodeId(431, 0));
//# sourceMappingURL=GetEndpointsResponse.js.map