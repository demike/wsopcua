import { encodeFilterOperator, decodeFilterOperator } from './FilterOperator';
import * as ec from '../basic-types';
/**

*/
export class ContentFilterElement {
    constructor(options) {
        options = options || {};
        this.filterOperator = (options.filterOperator) ? options.filterOperator : null;
        this.filterOperands = (options.filterOperands) ? options.filterOperands : [];
    }
    encode(out) {
        encodeFilterOperator(this.filterOperator, out);
        ec.encodeArray(this.filterOperands, out, ec.encodeExtensionObject);
    }
    decode(inp) {
        this.filterOperator = decodeFilterOperator(inp);
        this.filterOperands = ec.decodeArray(inp, ec.decodeExtensionObject);
    }
    clone(target) {
        if (!target) {
            target = new ContentFilterElement();
        }
        target.filterOperator = this.filterOperator;
        target.filterOperands = ec.cloneArray(this.filterOperands);
        return target;
    }
}
export function decodeContentFilterElement(inp) {
    let obj = new ContentFilterElement();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ContentFilterElement", ContentFilterElement, makeExpandedNodeId(585, 0));
//# sourceMappingURL=ContentFilterElement.js.map