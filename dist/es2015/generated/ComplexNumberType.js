import * as ec from '../basic-types';
/**

*/
export class ComplexNumberType {
    constructor(options) {
        options = options || {};
        this.real = (options.real) ? options.real : null;
        this.imaginary = (options.imaginary) ? options.imaginary : null;
    }
    encode(out) {
        ec.encodeFloat(this.real, out);
        ec.encodeFloat(this.imaginary, out);
    }
    decode(inp) {
        this.real = ec.decodeFloat(inp);
        this.imaginary = ec.decodeFloat(inp);
    }
    clone(target) {
        if (!target) {
            target = new ComplexNumberType();
        }
        target.real = this.real;
        target.imaginary = this.imaginary;
        return target;
    }
}
export function decodeComplexNumberType(inp) {
    let obj = new ComplexNumberType();
    obj.decode(inp);
    return obj;
}
import { register_class_definition } from "../factory/factories_factories";
import { makeExpandedNodeId } from '../nodeid/expanded_nodeid';
register_class_definition("ComplexNumberType", ComplexNumberType, makeExpandedNodeId(12181, 0));
//# sourceMappingURL=ComplexNumberType.js.map