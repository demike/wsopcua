import * as ec from '../basic-types';
/**

*/
export class SemanticChangeStructureDataType {
    constructor(options) {
        options = options || {};
        this.affected = (options.affected) ? options.affected : null;
        this.affectedType = (options.affectedType) ? options.affectedType : null;
    }
    encode(out) {
        ec.encodeNodeId(this.affected, out);
        ec.encodeNodeId(this.affectedType, out);
    }
    decode(inp) {
        this.affected = ec.decodeNodeId(inp);
        this.affectedType = ec.decodeNodeId(inp);
    }
    clone(target) {
        if (!target) {
            target = new SemanticChangeStructureDataType();
        }
        target.affected = this.affected;
        target.affectedType = this.affectedType;
        return target;
    }
}
export function decodeSemanticChangeStructureDataType(inp) {
    let obj = new SemanticChangeStructureDataType();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("SemanticChangeStructureDataType", SemanticChangeStructureDataType, makeExpandedNodeId(899, 0));
//# sourceMappingURL=SemanticChangeStructureDataType.js.map