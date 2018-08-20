import { RequestHeader } from './RequestHeader';
import { decodeDeleteReferencesItem } from './DeleteReferencesItem';
import * as ec from '../basic-types';
/**
Delete one or more references from the server address space.
*/
export class DeleteReferencesRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.referencesToDelete = (options.referencesToDelete) ? options.referencesToDelete : [];
    }
    encode(out) {
        this.requestHeader.encode(out);
        ec.encodeArray(this.referencesToDelete, out);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.referencesToDelete = ec.decodeArray(inp, decodeDeleteReferencesItem);
    }
    clone(target) {
        if (!target) {
            target = new DeleteReferencesRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        if (this.referencesToDelete) {
            target.referencesToDelete = ec.cloneComplexArray(this.referencesToDelete);
        }
        return target;
    }
}
export function decodeDeleteReferencesRequest(inp) {
    let obj = new DeleteReferencesRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DeleteReferencesRequest", DeleteReferencesRequest, makeExpandedNodeId(506, 0));
//# sourceMappingURL=DeleteReferencesRequest.js.map