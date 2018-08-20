import * as ec from '../basic-types';
import { NodeAttributes } from './NodeAttributes';
/**
The attributes for a data type node.
*/
export class DataTypeAttributes extends NodeAttributes {
    constructor(options) {
        options = options || {};
        super(options);
        this.isAbstract = (options.isAbstract) ? options.isAbstract : null;
    }
    encode(out) {
        super.encode(out);
        ec.encodeBoolean(this.isAbstract, out);
    }
    decode(inp) {
        super.decode(inp);
        this.isAbstract = ec.decodeBoolean(inp);
    }
    clone(target) {
        if (!target) {
            target = new DataTypeAttributes();
        }
        super.clone(target);
        target.isAbstract = this.isAbstract;
        return target;
    }
}
export function decodeDataTypeAttributes(inp) {
    let obj = new DataTypeAttributes();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DataTypeAttributes", DataTypeAttributes, makeExpandedNodeId(372, 0));
//# sourceMappingURL=DataTypeAttributes.js.map