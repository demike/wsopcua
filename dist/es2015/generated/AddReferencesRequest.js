import { RequestHeader } from './RequestHeader';
import { decodeAddReferencesItem } from './AddReferencesItem';
import * as ec from '../basic-types';
/**
Adds one or more references to the server address space.
*/
export class AddReferencesRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.referencesToAdd = (options.referencesToAdd) ? options.referencesToAdd : [];
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeArray(this.referencesToAdd, out);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.referencesToAdd = ec.decodeArray(inp, decodeAddReferencesItem);
    }
    clone(target) {
        if (!target) {
            target = new AddReferencesRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        if (this.referencesToAdd) {
            target.referencesToAdd = ec.cloneComplexArray(this.referencesToAdd);
        }
        return target;
    }
}
export function decodeAddReferencesRequest(inp) {
    let obj = new AddReferencesRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("AddReferencesRequest", AddReferencesRequest, makeExpandedNodeId(494, 0));
//# sourceMappingURL=AddReferencesRequest.js.map