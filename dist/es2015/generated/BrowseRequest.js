import { RequestHeader } from './RequestHeader';
import { ViewDescription } from './ViewDescription';
import * as ec from '../basic-types';
import { decodeBrowseDescription } from './BrowseDescription';
/**
Browse the references for one or more nodes from the server address space.
*/
export class BrowseRequest {
    constructor(options) {
        options = options || {};
        this.requestHeader = (options.requestHeader) ? options.requestHeader : new RequestHeader();
        this.view = (options.view) ? options.view : new ViewDescription();
        this.requestedMaxReferencesPerNode = (options.requestedMaxReferencesPerNode) ? options.requestedMaxReferencesPerNode : null;
        this.nodesToBrowse = (options.nodesToBrowse) ? options.nodesToBrowse : [];
    }
    encode(out) {
        this.requestHeader.encode(out);
        this.view.encode(out);
        ec.encodeUInt32(this.requestedMaxReferencesPerNode, out);
        ec.encodeArray(this.nodesToBrowse, out);
    }
    decode(inp) {
        this.requestHeader.decode(inp);
        this.view.decode(inp);
        this.requestedMaxReferencesPerNode = ec.decodeUInt32(inp);
        this.nodesToBrowse = ec.decodeArray(inp, decodeBrowseDescription);
    }
    clone(target) {
        if (!target) {
            target = new BrowseRequest();
        }
        if (this.requestHeader) {
            target.requestHeader = this.requestHeader.clone();
        }
        if (this.view) {
            target.view = this.view.clone();
        }
        target.requestedMaxReferencesPerNode = this.requestedMaxReferencesPerNode;
        if (this.nodesToBrowse) {
            target.nodesToBrowse = ec.cloneComplexArray(this.nodesToBrowse);
        }
        return target;
    }
}
export function decodeBrowseRequest(inp) {
    let obj = new BrowseRequest();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("BrowseRequest", BrowseRequest, makeExpandedNodeId(527, 0));
//# sourceMappingURL=BrowseRequest.js.map