import { RequestHeader } from './RequestHeader';
import * as ec from '../basic-types';
/**
Gets the endpoints used by the server.
*/
export class GetEndpointsRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.endpointUrl = (options.endpointUrl) ? options.endpointUrl : null;
        this.localeIds = (options.localeIds) ? options.localeIds : [];
        this.profileUris = (options.profileUris) ? options.profileUris : [];
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeString(this.endpointUrl, out);
        ec.encodeArray(this.localeIds, out, ec.encodeString);
        ec.encodeArray(this.profileUris, out, ec.encodeString);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.endpointUrl = ec.decodeString(inp);
        this.localeIds = ec.decodeArray(inp, ec.decodeString);
        this.profileUris = ec.decodeArray(inp, ec.decodeString);
    }
    clone(target) {
        if (!target) {
            target = new GetEndpointsRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        target.endpointUrl = this.endpointUrl;
        target.localeIds = ec.cloneArray(this.localeIds);
        target.profileUris = ec.cloneArray(this.profileUris);
        return target;
    }
}
export function decodeGetEndpointsRequest(inp) {
    let obj = new GetEndpointsRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("GetEndpointsRequest", GetEndpointsRequest, makeExpandedNodeId(428, 0));
//# sourceMappingURL=GetEndpointsRequest.js.map