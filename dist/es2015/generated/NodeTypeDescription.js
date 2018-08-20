import * as ec from '../basic-types';
import { decodeQueryDataDescription } from './QueryDataDescription';
/**

*/
export class NodeTypeDescription {
    constructor(options) {
        options = options || {};
        this.typeDefinitionNode = (options.typeDefinitionNode) ? options.typeDefinitionNode : null;
        this.includeSubTypes = (options.includeSubTypes) ? options.includeSubTypes : null;
        this.dataToReturn = (options.dataToReturn) ? options.dataToReturn : [];
    }
    encode(out) {
        ec.encodeExpandedNodeId(this.typeDefinitionNode, out);
        ec.encodeBoolean(this.includeSubTypes, out);
        ec.encodeArray(this.dataToReturn, out);
    }
    decode(inp) {
        this.typeDefinitionNode = ec.decodeExpandedNodeId(inp);
        this.includeSubTypes = ec.decodeBoolean(inp);
        this.dataToReturn = ec.decodeArray(inp, decodeQueryDataDescription);
    }
    clone(target) {
        if (!target) {
            target = new NodeTypeDescription();
        }
        target.typeDefinitionNode = this.typeDefinitionNode;
        target.includeSubTypes = this.includeSubTypes;
        if (this.dataToReturn) {
            target.dataToReturn = ec.cloneComplexArray(this.dataToReturn);
        }
        return target;
    }
}
export function decodeNodeTypeDescription(inp) {
    let obj = new NodeTypeDescription();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("NodeTypeDescription", NodeTypeDescription, makeExpandedNodeId(575, 0));
//# sourceMappingURL=NodeTypeDescription.js.map