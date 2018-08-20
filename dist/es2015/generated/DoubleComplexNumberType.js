import * as ec from '../basic-types';
/**

*/
export class DoubleComplexNumberType {
    constructor(options) {
        options = options || {};
        this.real = (options.real) ? options.real : null;
        this.imaginary = (options.imaginary) ? options.imaginary : null;
    }
    encode(out) {
        ec.encodeDouble(this.real, out);
        ec.encodeDouble(this.imaginary, out);
    }
    decode(inp) {
        this.real = ec.decodeDouble(inp);
        this.imaginary = ec.decodeDouble(inp);
    }
    clone(target) {
        if (!target) {
            target = new DoubleComplexNumberType();
        }
        target.real = this.real;
        target.imaginary = this.imaginary;
        return target;
    }
}
export function decodeDoubleComplexNumberType(inp) {
    let obj = new DoubleComplexNumberType();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("DoubleComplexNumberType", DoubleComplexNumberType, makeExpandedNodeId(12182, 0));
//# sourceMappingURL=DoubleComplexNumberType.js.map