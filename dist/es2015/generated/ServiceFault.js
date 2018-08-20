import { ResponseHeader } from './ResponseHeader';
/**
The response returned by all services when there is a service level error.
*/
export class ServiceFault {
    constructor(options) {
        options = options || {};
        this.responseHeader = (options.responseHeader) ? options.responseHeader : new ResponseHeader();
    }
    encode(out) {
        this.responseHeader.encode(out);
    }
    decode(inp) {
        this.responseHeader.decode(inp);
    }
    clone(target) {
        if (!target) {
            target = new ServiceFault();
        }
        if (this.responseHeader) {
            target.responseHeader = this.responseHeader.clone();
        }
        return target;
    }
}
export function decodeServiceFault(inp) {
    let obj = new ServiceFault();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ServiceFault", ServiceFault, makeExpandedNodeId(397, 0));
//# sourceMappingURL=ServiceFault.js.map