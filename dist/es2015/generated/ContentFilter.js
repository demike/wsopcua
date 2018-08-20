import { decodeContentFilterElement } from './ContentFilterElement';
import * as ec from '../basic-types';
/**

*/
export class ContentFilter {
    constructor(options) {
        options = options || {};
        this.elements = (options.elements) ? options.elements : [];
    }
    encode(out) {
        ec.encodeArray(this.elements, out);
    }
    decode(inp) {
        this.elements = ec.decodeArray(inp, decodeContentFilterElement);
    }
    clone(target) {
        if (!target) {
            target = new ContentFilter();
        }
        if (this.elements) {
            target.elements = ec.cloneComplexArray(this.elements);
        }
        return target;
    }
}
export function decodeContentFilter(inp) {
    let obj = new ContentFilter();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ContentFilter", ContentFilter, makeExpandedNodeId(588, 0));
//# sourceMappingURL=ContentFilter.js.map