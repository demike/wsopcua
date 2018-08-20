import * as ec from '../basic-types';
import { decodeVariant } from '../variant';
/**

*/
export class QueryDataSet {
    constructor(options) {
        options = options || {};
        this.nodeId = (options.nodeId) ? options.nodeId : null;
        this.typeDefinitionNode = (options.typeDefinitionNode) ? options.typeDefinitionNode : null;
        this.values = (options.values) ? options.values : [];
    }
    encode(out) {
        ec.encodeExpandedNodeId(this.nodeId, out);
        ec.encodeExpandedNodeId(this.typeDefinitionNode, out);
        ec.encodeArray(this.values, out);
    }
    decode(inp) {
        this.nodeId = ec.decodeExpandedNodeId(inp);
        this.typeDefinitionNode = ec.decodeExpandedNodeId(inp);
        this.values = ec.decodeArray(inp, decodeVariant);
    }
    clone(target) {
        if (!target) {
            target = new QueryDataSet();
        }
        target.nodeId = this.nodeId;
        target.typeDefinitionNode = this.typeDefinitionNode;
        if (this.values) {
            target.values = ec.cloneComplexArray(this.values);
        }
        return target;
    }
}
export function decodeQueryDataSet(inp) {
    let obj = new QueryDataSet();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("QueryDataSet", QueryDataSet, makeExpandedNodeId(579, 0));
//# sourceMappingURL=QueryDataSet.js.map